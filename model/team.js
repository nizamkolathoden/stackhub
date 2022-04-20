const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    desc:{
        type:String,
 
    },
    //its for which year he will return the community
    year: {
        type: Date
    }
})
module.exports = mongoose.model("team",teamSchema);