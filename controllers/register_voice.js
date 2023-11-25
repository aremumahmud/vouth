const User = require("../Models/UserModel");
const cloudinary = require("../utils/cloudinary");

async function RegisterVoice(req, res) {
    //console.log(req.body);
    const { userId } = req.body;

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
                        console.log(error)
                        throw error;
                    }

                    let user;
                    try {
                        user = await User.findById(userId);
                    } catch (e) {
                        user = null
                    }

                    // console.log(user , result)

                    if (!user) {
                        console.log(user)
                        return res
                            .status(401)
                            .json({
                                error: true,
                                sucess: false,
                                message: "User not Found, You have to register first to register a voice",
                            });
                    }

                    console.log(user)
                    user.voice = result.secure_url;
                    user = await user.save();

                    res.json({ user });
                }
            )
            .end(req.file.buffer);
    } catch (error) {
        //console.log(error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = RegisterVoice