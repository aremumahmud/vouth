const User = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function Login(req, res) {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username: username });

    // Check if user exists and compare passwords
    if (user && (await bcrypt.compare(password, user.password))) {
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, "your-secret-key");
        res.json({ error: false, token });
    } else {
        res.status(401).json({ error: true, message: "Authorization failed" });
    }
}

module.exports = Login