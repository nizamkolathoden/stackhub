const express = require("express");

const env = require('dotenv');
const Booked = require("./model/bookedScheam")
const {verifyAdminAccessToken,verifyUserAccessToken} = require('./helper/jwt_helper')

const morgon = require('morgan')
const cors = require("cors")
env.config()


const PORT = process.env.PORT;

const app = express();

app.use(morgon('dev'))

app.use(cors())

app.use(express.json());

app.get("/",verifyUserAccessToken,(req,res)=>{
    res.json('hello user')
})

//router
app.use("/admin",verifyAdminAccessToken,require('./router/adminRouter'));

app.use("/all",require('./router/allRouter'));

app.use("/auth",require('./router/authRouter'));

app.use("/user",verifyUserAccessToken,require('./router/userRouter'))
//db
require('./helper/DB')()

//for testing
app.post("/test",async(req,res)=>{
    const {id} = req.body
    const data = await Booked.findById(id).populate("eventId","name location").populate("whoBooked","name email")
    res.json(data)
})

app.listen(PORT,()=>console.log(`app listening on Port ${PORT}`))
