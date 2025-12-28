// backend/server.js

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { connectDB } = require("./config/db");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  exposedHeaders: ["Content-Disposition"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static (if needed later)
app.use("/certificates", express.static(path.join(__dirname, "certificates")));

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   ROUTES
========================= */
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require("./routes/enrollments");
const paymentRoutes = require("./routes/payments");
const invoiceRoutes = require("./routes/invoice");
const instructorRoutes = require("./routes/instructor");
const adminRoutes = require("./routes/adminRoutes");


app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

/* =========================
   TEST
========================= */
app.get("/", (req, res) => {
  res.json({ message: "E-learnify API is running!" });
});



/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
