const User = require("../Models/UserModel");
const cloudinary = require("../utils/cloudinary");
const performVoiceEnrollment = require("../utils/enroll_user");
const transcribe = require("./transcribe");
const stSimilarity = require("string-similarity");
const performVoiceAuthenticate = require("../utils/Authenticate_user");

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

                    let verificationResult;

                    if (user.voices_array.length === 0) {

                        try {
                            //Perform voice verification logic (replace with your own logic)

                            verificationResult = await performVoiceAuthenticate(
                                result.secure_url
                            );

                            // console.log(verificationResult)
                        } catch (err) {
                            // console.log(err, 11);
                            return res.status(500).json({
                                sucess: false,
                                error: true,
                                message: "Internal Server Error",
                            });
                        }
                    }



                    if (!verificationResult && user.voices_array.length === 0) {
                        console.log(verificationResult)
                        return res.status(500).json({
                            sucess: false,
                            error: true,
                            message: "Internal Server Error",
                        });
                    }

                    if (verificationResult && verificationResult.sucess && user.voices_array.length === 0) {
                        // Generate JWT token

                        return res.status(401).json({
                            message: "You cannot register your voice twice, Please login" + verificationResult.confidence,
                            error: true,
                            sucess: false,
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
