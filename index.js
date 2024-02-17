// index.js
const express = require("express");

// const multer = require("multer");
// const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
// const RegisterVoice = require("./controllers/register_voice");
// const VerifyVoice = require("./controllers/verify_voice");
// const SignUp = require("./controllers/Signup");
// const Login = require("./controllers/Login");
// const User = require('./Models/UserModel')
// const AuthJWT = require('./controllers/authenticate')
// require('./utils/cloudinary')
// require('./utils/databaseConn')
// dotenv.config();

// const storage = multer.memoryStorage();
// const parser = multer({ storage: storage });

const app = express();
const port = process.env.port || 4000;

app.use(express.static(path.join(__dirname, "/public")));


// Configure Cloudinary
app.use(cors());
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded())

// Signup route
// app.post("/signup", SignUp);

// // Login route
// app.post("/login", Login);

// // Register voice route
// app.post("/register-voice", parser.single("voice"), RegisterVoice);

// app.post("/verify-voice", parser.single("voice"), VerifyVoice);

// app.post('/personal', async(req, res) => {
//     const { userId } = req.body
//     let user;
//     try {
//         user = await User.findById(userId);
//     } catch (e) {
//         user = null;
//     }

//     // console.log(user , result)

//     if (!user) {
//         // console.log(user);
//         return res.status(401).json({
//             error: true,
//             sucess: false,
//             message: "User not Found, You have to register first to insert your personal information",
//         });



//     }

//     Object.assign(user, req.body)

//     try {
//         await user.save()
//         res.send({ sucess: true, error: false })
//     } catch (err) {
//         res.status(401).json({ sucess: false, error: true, message: 'An unexpected error occured, Please try again' })
//     }
// })

// app.post('/userInfo', AuthJWT, async(req, res) => {

//     const { userId } = req
//     let user;
//     try {
//         user = await User.findById(userId);
//     } catch (e) {
//         user = null;
//     }

//     // console.log(user , result)

//     if (!user) {
//         // console.log(user);
//         return res.status(401).json({
//             error: true,
//             sucess: false,
//             message: "User not Found, You have to register first to access the dashboard",
//         });

//     }

//     res.json({
//         ...user._doc,
//         password: null,
//         voice: null,
//         error: false,
//         sucess: true,
//     })
// })

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});