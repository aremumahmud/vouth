// index.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const CloudinaryStorage =
  require("multer-storage-cloudinary").CloudinaryStorage;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const performVoiceVerification = require("./verify_voice");
const path = require("path")

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.memoryStorage();
const parser = multer({ storage: storage });

const app = express();
const port = process.env.port || 4000;

app.use(express.static(path.join(__dirname , "/public")))

const uri = process.env.MONGOOSE_URI || "mongodb://127.0.0.1:27017/testdb101";
// Connect to MongoDB
mongoose.connect(uri);

// Define User schema and model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  voice: String, // Array to store Cloudinary URLs
});

const User = mongoose.model("User", userSchema);

// Configure Cloudinary
app.use(cors());
// Middleware to parse JSON
app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user to MongoDB
  const newUser = new User({
    username: username,
    password: hashedPassword,
  });

  await newUser.save();

  res.send({ id: newUser._id });
});

// Login route
app.post("/login", async (req, res) => {
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
});

// Register voice route
app.post("/register-voice", parser.single("voice"), async (req, res) => {
  console.log(req.body);
  const { userId } = req.body;

  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video",
          use_filename: true,
          unique_filename: false,
          folder: "audio",
          format: "wav", // Specify the desired format
        },
        async (error, result) => {
          if (error) {
            throw error;
          }

          let user = await User.findById(userId);
          user.voice = result.secure_url;
          user = await user.save();

          res.json({ user });
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/verify-voice", parser.single("voice"), async (req, res) => {
  console.log(req.body);
  const { username } = req.body;

  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video",
          use_filename: true,
          unique_filename: false,
          folder: "audio",
          format: "wav", // Specify the desired format
        },
        async (error, result) => {
          if (error) {
            throw error;
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
            return res.status(500).json({ error: "Internal Server Error" });
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
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
