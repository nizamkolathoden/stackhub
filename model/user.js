const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        uniuqe: true
    },
    password: {
        type: String,
        required: true
    },
    career:String,
    district:String,
    home:String,
    institution:String,
    intersted:String,
    pronoun:String,
    stream:String,
    year:String,
    dob: {
        type: Date
    },
    isVerfiyed: {
        type: Boolean,
        default: false
    }

})

module.exports = mongoose.model("user", userSchema);