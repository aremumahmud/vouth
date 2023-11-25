const dotenv = require("dotenv");
dotenv.config()

const mongoose = require("mongoose");


const uri = process.env.MONGOOSE_URI || "mongodb://127.0.0.1:27017/testdb101";
// Connect to MongoDB
mongoose.connect(uri).then(() => {
    console.log("connected");
});