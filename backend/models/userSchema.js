const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uniqueCredential: {
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("users", userSchema)