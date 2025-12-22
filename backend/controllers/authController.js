// backend/controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { getDb } = require("../config/db"); // 🔥 FIX: must be getDb

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = getDb();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   REGISTER
========================= */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = "user" } = req.body;

    const db = getDb();
    const users = db.collection("users");

    const exists = await users.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};
