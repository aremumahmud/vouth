const mongoose = require("mongoose");

// Define User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    voice: String, // Array to store Cloudinary URLs
    full_name: String,
    date_of_birth: String,
    course: String,
    address: String
});

const User = mongoose.model("User", userSchema);

module.exports = User