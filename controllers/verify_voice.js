const User = require("../Models/UserModel");
const performVoiceVerification = require("../utils/verify_voice");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

async function VerifyVoice(req, res) {
    console.log(req.body);
    const { username } = req.body;

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

                    const user = await User.findOne({ username: username });

                    if (!user)
                        return res
                            .status(401)
                            .json({ error: true, message: "username not found" });

                    const userVoice = user.voice;
                    const voiceUrl = result.secure_url;

                    if (!userVoice)
                        return res.status(401).json({
                            sucess: false,
                            error: true,
                            message: "voice_not_registered",
                            userId: user._id,
                        });

                    let verificationResult;
                    try {
                        //Perform voice verification logic (replace with your own logic)

                        verificationResult = await performVoiceVerification(
                            voiceUrl,
                            userVoice
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
                        const token = jwt.sign({ userId: user._id }, "your-secret-key");
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