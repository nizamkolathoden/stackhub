const router = require('express').Router();

const User = require("../controller/userController")

//@desc book a event
//@route /user/events/register
router.put("/events/register", User.bookEvents);

//@desc show all user booked events
//@route /user/events/booked
router.get("/events/booked", User.bookedEvent);

//@desc book a event
//@route /user/events/register
router.get("/events", User.ourEvents);

module.exports = router;