const User = require("../Models/UserModel");
const performVoiceVerification = require("../utils/verify_voice");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const transcribe = require("./transcribe");
const stSimilarity = require("string-similarity");
const performVoiceAuthenticate = require("../utils/Authenticate_user");

async function VerifyVoice(req, res) {
    // console.log(req.body);
    const { mobile, username } = req.body;

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
                        return res
                            .status(401)
                            .json({ error: true, message: "an unexpected error occured" });
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
                        user = await User.findOne({ username });
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


                    const voiceUrl = result.secure_url;
                    const voices_array = user.voices_array

                    let verificationResult;
                    try {
                        //Perform voice verification logic (replace with your own logic)

                        verificationResult = await performVoiceAuthenticate(
                            voiceUrl,
                            voices_array

                        );
                    } catch (err) {
                        console.log(err, 11);
                        return res.status(500).json({
                            sucess: false,
                            error: true,
                            message: "Internal Server Error",
                        });
                    }
                    if (!verificationResult) {
                        return res.status(500).json({
                            sucess: false,
                            error: true,
                            message: "Internal Server Error",
                        });
                    }
                    if (verificationResult.sucess) {
                        // Generate JWT token
                        const token = jwt.sign({ userId: verificationResult.userId }, "your-secret-key");
                        res.json({ error: false, token });
                    } else {
                        res.status(401).json(verificationResult);
                    }
                }
            )
            .end(req.file.buffer);
    } catch (error) {
        console.log(error, 1);
        // console.error(error);
        res.status(500).json({
            sucess: false,
            error: true,
            message: "Internal Server Error",
        });
    }
}


module.exports = VerifyVoice