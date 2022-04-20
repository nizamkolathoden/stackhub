const mongoose = require("mongoose");

const {ObjectId} = mongoose.SchemaTypes;


const bookedSchema = new mongoose.Schema({
   eventId:{
       type:ObjectId,
       ref:'events',
   },
   whoBooked:{
    type:ObjectId,
    ref:'user'
   }

})

module.exports = mongoose.model("booked",bookedSchema);