// index.js
const express = require("express");

const multer = require("multer");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const RegisterVoice = require("./controllers/register_voice");
const VerifyVoice = require("./controllers/verify_voice");
const SignUp = require("./controllers/Signup");
const Login = require("./controllers/Login");
require('./utils/cloudinary')
require('./utils/databaseConn')
dotenv.config();

const storage = multer.memoryStorage();
const parser = multer({ storage: storage });

const app = express();
const port = process.env.port || 4000;

app.use(express.static(path.join(__dirname, "/public")));


// Configure Cloudinary
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Signup route
app.post("/signup", SignUp);

// Login route
app.post("/login", Login);

// Register voice route
app.post("/register-voice", parser.single("voice"), RegisterVoice);

app.post("/verify-voice", parser.single("voice"), VerifyVoice);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});