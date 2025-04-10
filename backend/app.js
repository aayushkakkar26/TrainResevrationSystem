const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const db = require("./db"); // ✅ Add this line
const environment = process.env.NODE_ENV || 'development';
const config = require(`./config/${environment}.json`);
const authRoutes = require("./routes/authRoutes");
const seatRoutes = require("./routes/seatRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: config.frontendUrl,
    credentials: true
  }));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api", protectedRoutes);

// Test DB route
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ message: "DB connected!", time: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});



app.get("/", (req, res) => {
    res.send("Train Seat Reservation System API running ✅");
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
