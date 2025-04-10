const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const { signup, login, logout, authenticate } = require("../controllers/authController");

// Routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", verifyToken, authenticate);

module.exports = router;
