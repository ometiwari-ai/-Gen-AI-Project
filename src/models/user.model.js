const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username already exists"],
        required: [true, "Username is required"]
    },

    email : {
        type: String,
        unique: [true, "Email already exists"],
        required: true
    },

    password: {
        type : String,
        required : true
    }
})

const userModel = mongoose.model("User", userschema)

module.exports = userModel;