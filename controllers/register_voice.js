const User = require("../Models/UserModel");
const cloudinary = require("../utils/cloudinary");
const performVoiceEnrollment = require("../utils/enroll_user");
const transcribe = require("./transcribe");
const stSimilarity = require("string-similarity");

async function RegisterVoice(req, res) {
    //console.log(req.body);
    const { userId, mobile } = req.body;
    console.log(mobile);
    try {
        // Upload the file to Cloudinary
        const result = await cloudinary.uploader
            .upload_stream({
                    resource_type: "video",
                    use_filename: true,
                    unique_filename: false,
                    folder: "audio",
                    format: "wav", // Specify the desired format
                },
                async(error, result) => {
                    if (error) {
                        console.log(error);
                        throw error;
                    }

                    if (mobile === 'true') {
                        let { transcript } = await transcribe(result.secure_url);
                        let phrase =
                            "Whispering winds, dancing leaves, under the Whispering leaves";
                        let isSimilar =
                            stSimilarity.compareTwoStrings(phrase, transcript) >= 0.5;

                        if (!isSimilar) {
                            return res.status(401).json({
                                error: true,
                                sucess: false,
                                message: `Your provided phrase ('[ ${transcript} ]') doesn't match the expected key phrase. Please double-check and try again.`,
                            });
                        }
                    }



                    let user;
                    try {
                        user = await User.findById(userId);
                    } catch (e) {
                        user = null;
                    }

                    // console.log(user , result)

                    if (!user) {
                        console.log(user);
                        return res.status(401).json({
                            error: true,
                            sucess: false,
                            message: "User not Found, You have to register first to register a voice",
                        });
                    }

                    if (user.voices_array.length === 3) {
                        return res.json({ done: true, user })
                    }

                    user.voices_array.push(result.secure_url)
                    user.voice = result.secure_url;
                    user = await user.save();

                    let to_done_count = user.voices_array.length

                    if (to_done_count < 3) {
                        return res.json({ done: false, count: to_done_count })
                    }

                    let Enrollment_status = await performVoiceEnrollment(user._id, user.voices_array)

                    if (Enrollment_status.sucess) {
                        return res.json({ user, done: true });
                    }
                    res.status(401).json({
                        error: true,
                        sucess: false,
                        message: Enrollment_status.message,
                    });

                }
            )
            .end(req.file.buffer);
    } catch (error) {
        //console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = RegisterVoice;