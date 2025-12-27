// routes/admin.routes.js
const express = require("express");
const { ObjectId } = require("mongodb");
const { authenticate, authorizeRoles } = require("../middleware/auth");
const { getDb } = require("../config/db");
const { isValidObjectId } = require("../utils/validators");

const router = express.Router();

/**
 * Collections used:
 * users: { _id, name, email, role: "student"|"instructor"|"admin", status: "active"|"blocked", createdAt }
 * courses: { _id, title, price, status: "draft"|"pending"|"published"|"rejected", instructorId, createdAt }
 * payments: { _id, userId, courseId, amount, status: "SUCCESS"|"FAILED"|"PENDING", trxId, createdAt }
 * enrollments: { _id, userId, courseId, paymentId, status: "active"|"revoked", createdAt }
 */

// ✅ Everything here requires Admin
router.use(authenticate, authorizeRoles("admin"));

/* =========================
   1) USER CONTROL LOGIC
========================= */

// Block / Unblock user
router.patch("/users/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // "active" or "blocked"

  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid user id" });
  if (!["active", "blocked"].includes(status))
    return res.status(400).json({ message: "Invalid status" });

  const db = getDb();
  const result = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: { status } });

  if (!result.matchedCount)
    return res.status(404).json({ message: "User not found" });

  return res.json({ message: `User status updated to ${status}` });
});

// Assign role (student/instructor/admin) — business control
router.patch("/users/:id/role", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid user id" });
  if (!["student", "instructor", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const db = getDb();
  const result = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, { $set: { role } });

  if (!result.matchedCount)
    return res.status(404).json({ message: "User not found" });

  return res.json({ message: `User role updated to ${role}` });
});

/* =========================
   2) COURSE APPROVAL LOGIC
========================= */

// Approve course -> publish
router.patch("/courses/:id/approve", async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid course id" });

  const db = getDb();
  const course = await db
    .collection("courses")
    .findOne({ _id: new ObjectId(id) });
  if (!course) return res.status(404).json({ message: "Course not found" });

  // Business rule: only pending can be approved
  if (course.status !== "pending") {
    return res
      .status(400)
      .json({ message: "Only pending courses can be approved" });
  }

  await db
    .collection("courses")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "published", publishedAt: new Date() } }
    );

  return res.json({ message: "Course approved & published" });
});

// Reject course
router.patch("/courses/:id/reject", async (req, res) => {
  const { id } = req.params;
  const { reason = "Not specified" } = req.body;

  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid course id" });

  const db = getDb();
  const course = await db
    .collection("courses")
    .findOne({ _id: new ObjectId(id) });
  if (!course) return res.status(404).json({ message: "Course not found" });

  await db
    .collection("courses")
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "rejected",
          rejectionReason: reason,
          rejectedAt: new Date(),
        },
      }
    );

  return res.json({ message: "Course rejected" });
});

/* =========================
   3) PRICING & DISCOUNT CONTROL
========================= */

// Update course price (only admin can control pricing)
router.patch("/courses/:id/price", async (req, res) => {
  const { id } = req.params;
  const { price } = req.body;

  if (!isValidObjectId(id))
    return res.status(400).json({ message: "Invalid course id" });
  if (typeof price !== "number" || price < 0)
    return res.status(400).json({ message: "Invalid price" });

  const db = getDb();
  const result = await db
    .collection("courses")
    .updateOne({ _id: new ObjectId(id) }, { $set: { price } });

  if (!result.matchedCount)
    return res.status(404).json({ message: "Course not found" });

  return res.json({ message: "Course price updated" });
});

/* =========================
   4) PAYMENT VALIDATION + ENROLLMENT BUSINESS LOGIC
   Rule: enroll only after payment SUCCESS
========================= */

// Admin marks payment as SUCCESS and creates enrollment (manual verification flow)
router.post("/payments/:paymentId/confirm", async (req, res) => {
  const { paymentId } = req.params;

  if (!isValidObjectId(paymentId))
    return res.status(400).json({ message: "Invalid payment id" });

  const db = getDb();
  const payment = await db
    .collection("payments")
    .findOne({ _id: new ObjectId(paymentId) });
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  // Update payment status -> SUCCESS
  await db
    .collection("payments")
    .updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: "SUCCESS",
          confirmedAt: new Date(),
          confirmedBy: req.user.userId,
        },
      }
    );

  // Business rule: enrollment only if payment SUCCESS
  // Prevent duplicate enrollment
  const existing = await db.collection("enrollments").findOne({
    userId: payment.userId,
    courseId: payment.courseId,
    status: "active",
  });

  if (!existing) {
    await db.collection("enrollments").insertOne({
      userId: payment.userId,
      courseId: payment.courseId,
      paymentId: payment._id.toString(),
      status: "active",
      createdAt: new Date(),
    });
  }

  return res.json({ message: "Payment confirmed & enrollment created" });
});

// Refund logic: revoke enrollment + mark payment as REFUNDED
router.post("/payments/:paymentId/refund", async (req, res) => {
  const { paymentId } = req.params;
  const { reason = "Refund approved" } = req.body;

  if (!isValidObjectId(paymentId))
    return res.status(400).json({ message: "Invalid payment id" });

  const db = getDb();
  const payment = await db
    .collection("payments")
    .findOne({ _id: new ObjectId(paymentId) });
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  // Mark payment refunded
  await db
    .collection("payments")
    .updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: "REFUNDED",
          refundReason: reason,
          refundedAt: new Date(),
        },
      }
    );

  // Revoke enrollment
  await db
    .collection("enrollments")
    .updateMany(
      { userId: payment.userId, courseId: payment.courseId, status: "active" },
      { $set: { status: "revoked", revokedAt: new Date() } }
    );

  return res.json({ message: "Refund done & enrollment revoked" });
});

/* =========================
   5) REPORTS (Business analytics)
========================= */

router.get("/reports/summary", async (req, res) => {
  const db = getDb();

  const totalUsers = await db.collection("users").countDocuments();
  const totalCourses = await db.collection("courses").countDocuments();
  const totalEnrollments = await db
    .collection("enrollments")
    .countDocuments({ status: "active" });

  const revenueAgg = await db
    .collection("payments")
    .aggregate([
      { $match: { status: "SUCCESS" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ])
    .toArray();

  const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

  return res.json({ totalUsers, totalCourses, totalEnrollments, totalRevenue });
});

module.exports = router;
