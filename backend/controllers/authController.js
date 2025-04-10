const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db"); // this is your PostgreSQL pool instance

// Signup controller
const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Insert new user into DB
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    // 4. Generate JWT Token
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 5. Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "User created", user: newUser.rows[0] });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Login controller
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare passwords
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT Token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 4. Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user: user.rows[0] });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Logout controller
const logout = (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
};


const authenticate = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, email, username FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    res.status(200).json({ user }); // ✅ wrap in { user }
  } catch (error) {
    console.error("Error in /me route:", error.message);
    res.status(500).json({ message: "Failed to authenticate user" });
  }
};


module.exports = { signup, login, logout, authenticate };
