const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");

async function SignUp(req, res) {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username });

    if (user)
        return res.status(401).json({
            error: true,
            message: "username exists! please sign in instead if you own this account",
        });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to MongoDB
    const newUser = new User({
        username: username,
        password: hashedPassword,
    });

    await newUser.save();

    res.send({ id: newUser._id });
}

module.exports = SignUp