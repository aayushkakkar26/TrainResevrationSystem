const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const { bookSeats, resetSeats, getAllSeats} = require('../controllers/seatController');
const router = express.Router();


router.get("/", verifyToken, getAllSeats );

router.post("/book", verifyToken, bookSeats);

router.post("/reset", verifyToken, resetSeats);

module.exports = router;