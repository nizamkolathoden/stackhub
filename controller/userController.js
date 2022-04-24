
const Events = require('../model/events')

 const Booked = require('../model/bookedScheam')

const Users = require("../model/user");

const mail = require('../helper/mail')

const mongoose = require("mongoose");



module.exports = {
  bookEvents: async (req, res) => {
    try {
      const userId = req.payload.aud;
      const { eventId } = req.body;

      console.log(userId)

      if (!eventId)
        return res.status(503).json({ error: "select A event" })


      const userData = await Users.findById(userId, { email: 1, name: 1, _id: 0 })
      const { email, name } = userData;


      const Event = await Events.aggregate([
        {
          $match: { "_id": mongoose.Types.ObjectId(eventId) }
        },
        {
          $project: {
            totalSeat: 1,
            bookedSeat: { $size: "$booked" },
            isBooked: {
              $in: [mongoose.Types.ObjectId(userId), "$booked"]
            }
          }
        }])



  

      console.log(Event[0])

      if (Event[0] ? Event[0].isBooked : false)
        return res.json({ error: "You Already Booked This Event" })

      if (Event ? Event[0].totalSeat <= Event[0].bookedSeat : false)
        return res.json({ error: "Sorry Seat's Are full" })

      const Updated = await Events.findByIdAndUpdate(eventId, {
        $addToSet: { booked: [userId] }
      }, {
        new: true
      })

      const addedBook = await new Booked({
        eventId:Updated._id,
        whoBooked:userId
      }).save()

      // console.log(addedBook);



      res.json("Thanks for Register Our Event")




      const text = `👋🏼 Hey ${name} Thanks for Book Our Event ${Updated.name} 
        🤗 Resourse Person :${Updated.resoursePerson}
        📍 Location: ${Updated.location} 📆 Date:${Updated.date} 
        ${Updated.meetUrl ? `Meet Link 🔗${Updated.meetUrl}` : ``}`

      const subject = 'Thanks for Booking Our Event 👻'
      
      const html = `<h3>${text}</h3>`

      mail(email,subject,text,html);

      

    } catch (err) {

      console.log(err.message)

      res.status(500).json({ error: "Internal Server Error" })
    }



  },
  bookedEvent:async(req,res)=>{
    try {
      const userId = req.payload.aud;
      const bookedData = await Booked.find({whoBooked:userId}).populate("eventId","pic name date location")
      res.json(bookedData)
    } catch (err) {
      
    }
  },
  ourEvents: async (req, res) => {
    try {
      const userId = req.payload.aud;
      const username = await Users.findById(userId,"name")
        const upcomingEvent = await Events.aggregate([
            {
                $addFields: { isNotOver: { $gte: ["$date", new Date()] } }
            },
            { $match: { "isNotOver": true } },
            {
                $project:
                {
                    name: 1,
                    type: 1,
                    location: 1,
                    totalSeat: 1,
                    pic: 1,
                    resoursePerson: 1,
                    fee: 1,

                    year: { $year: "$date" },

                    month: { $month: "$date" },

                    day: { $dayOfMonth: "$date" },

                    hour: { $hour: "$date" },

                    minute: { $minute: "$date" },

                    availableSeat: { $subtract: ["$totalSeat", { $size: "$booked" }] }


                }
            }
        ])

        res.json({upcomingEvent,username})
    } catch (err) {

        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }



}
}