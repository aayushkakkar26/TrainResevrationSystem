// routes/protectedRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");


router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "🎉 You are authorized to access this protected route!",
    user: req.user
  });
});



module.exports = router;
