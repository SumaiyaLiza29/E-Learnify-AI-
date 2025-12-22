// backend/controllers/paymentController.js

const SSLCommerzPayment = require("sslcommerz-lts");
const PDFDocument = require("pdfkit");
const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");

const store_id = process.env.SSLCOMMERZ_STORE_ID || "test";
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || "test";
const is_live = false;

/* =========================
   INITIATE PAYMENT
========================= */
exports.initiatePayment = async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    const userId = req.user.id;

    const db = getDb();
    const enrollments = db.collection("enrollments");
    const courses = db.collection("courses");
    const users = db.collection("users");

    const enrollment = await enrollments.findOne({
      _id: new ObjectId(enrollmentId),
    });
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    if (enrollment.userId.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized" });

    const course = await courses.findOne({
      _id: new ObjectId(enrollment.courseId),
    });
    const user = await users.findOne({
      _id: new ObjectId(enrollment.userId),
    });

    const amount = course?.price || 100;
    const tran_id = `TXN_${Date.now()}_${enrollmentId}`;

    const paymentData = {
      total_amount: amount,
      currency: "BDT",
      tran_id,
      success_url: `${process.env.BACKEND_URL}/api/payments/success?enrollmentId=${enrollmentId}`,
      fail_url: `${process.env.BACKEND_URL}/api/payments/fail?enrollmentId=${enrollmentId}`,
      cancel_url: `${process.env.BACKEND_URL}/api/payments/cancel?enrollmentId=${enrollmentId}`,
      ipn_url: `${process.env.BACKEND_URL}/api/payments/ipn`,
      shipping_method: "No",
      product_name: course?.title || "Online Course",
      product_category: "Education",
      product_profile: "general",
      cus_name: user?.name || "Student",
      cus_email: user?.email || "student@example.com",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    const apiResponse = await sslcz.init(paymentData);

    await enrollments.updateOne(
      { _id: new ObjectId(enrollmentId) },
      {
        $set: {
          paymentId: tran_id,
          paymentGateway: "SSLCommerz",
          amount,
        },
      }
    );

    res.json({ paymentUrl: apiResponse.GatewayPageURL });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   PAYMENT CALLBACKS
========================= */
exports.paymentSuccess = async (req, res) => {
  try {
    const enrollmentId =
      req.query.enrollmentId || req.body.enrollmentId;

    if (!enrollmentId) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
    }

    const db = getDb();
    const enrollments = db.collection("enrollments");
    const courses = db.collection("courses");
    const users = db.collection("users");
    const invoices = db.collection("invoices");

    // update enrollment
    const enrollment = await enrollments.findOneAndUpdate(
      { _id: new ObjectId(enrollmentId) },
      {
        $set: {
          paymentStatus: "completed",
          status: "active",
          paymentDate: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!enrollment.value) {
      return res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
    }

    const course = await courses.findOne({
      _id: new ObjectId(enrollment.value.courseId),
    });

    const user = await users.findOne({
      _id: new ObjectId(enrollment.value.userId),
    });

    // 🔥 CREATE INVOICE
    await invoices.insertOne({
      enrollmentId: new ObjectId(enrollmentId),
      studentId: new ObjectId(enrollment.value.userId),
      studentName: user?.name || "Student",
      studentEmail: user?.email || "student@example.com",
      courseTitle: course?.title || "Online Course",
      amount: enrollment.value.amount || course?.price || 0,
      paymentMethod: "SSLCommerz",
      transactionId: enrollment.value.paymentId,
      status: "paid",
      invoiceNumber: `INV-${Date.now()}`,
      createdAt: new Date(),
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/my-courses?payment=success`
    );
  } catch (error) {
    console.error("Payment success error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/payment-error`);
  }
};


exports.paymentFail = async (req, res) => {
  const { enrollmentId } = req.query;
  await getDb()
    .collection("enrollments")
    .updateOne(
      { _id: new ObjectId(enrollmentId) },
      { $set: { paymentStatus: "failed" } }
    );
  res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};

exports.paymentCancel = async (req, res) => {
  const { enrollmentId } = req.query;
  await getDb()
    .collection("enrollments")
    .updateOne(
      { _id: new ObjectId(enrollmentId) },
      { $set: { paymentStatus: "cancelled" } }
    );
  res.redirect(`${process.env.FRONTEND_URL}/payment-cancelled`);
};

exports.paymentIPN = async (req, res) => {
  const { tran_id, status } = req.body;
  if (status === "VALID") {
    await getDb()
      .collection("enrollments")
      .updateOne(
        { paymentId: tran_id },
        { $set: { paymentStatus: "completed", status: "active" } }
      );
  }
  res.json({ ok: true });
};

/* =========================
   INVOICE
========================= */
exports.downloadInvoice = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id;

    const db = getDb();
    const enrollments = db.collection("enrollments");
    const courses = db.collection("courses");
    const users = db.collection("users");

    const enrollment = await enrollments.findOne({
      _id: new ObjectId(enrollmentId),
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (enrollment.paymentStatus !== "completed") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const course = await courses.findOne({
      _id: new ObjectId(enrollment.courseId),
    });

    const user = await users.findOne({
      _id: new ObjectId(enrollment.userId),
    });

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${enrollmentId}.pdf"`
    );

    doc.pipe(res);

    /* =========================
       HEADER
    ========================= */
    doc
      .fillColor("#1f2937")
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("E-Learnify", { align: "left" });

    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#6b7280")
      .text("Online Learning Platform");

    doc.moveDown(1.5);

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#111827")
      .text("INVOICE", { align: "right" });

    doc.moveDown(2);

    /* =========================
       INVOICE INFO
    ========================= */
    doc
      .fontSize(12)
      .font("Helvetica")
      .fillColor("#374151")
      .text(`Invoice ID: INV-${enrollmentId.slice(-8).toUpperCase()}`)
      .text(`Invoice Date: ${new Date().toLocaleDateString()}`)
      .text(
        `Payment Date: ${
          enrollment.paymentDate
            ? new Date(enrollment.paymentDate).toLocaleDateString()
            : "N/A"
        }`
      );

    doc.moveDown(1.5);

    /* =========================
       BILL TO
    ========================= */
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#111827")
      .text("BILL TO");

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#374151")
      .text(user?.name || "Student")
      .text(user?.email || "student@example.com");

    doc.moveDown(2);

    /* =========================
       COURSE TABLE
    ========================= */
    const tableTop = doc.y;

    doc
      .font("Helvetica-Bold")
      .fillColor("#ffffff")
      .rect(50, tableTop, 500, 30)
      .fill("#2563eb");

    doc
      .fillColor("#ffffff")
      .fontSize(12)
      .text("Course", 60, tableTop + 9)
      .text("Amount", 430, tableTop + 9, { align: "right" });

    const rowY = tableTop + 40;

    doc
      .font("Helvetica")
      .fillColor("#111827")
      .fontSize(12)
      .text(course?.title || "Online Course", 60, rowY)
      .text(
        `$${enrollment.amount || course?.price || "0"}`,
        430,
        rowY,
        { align: "right" }
      );

    doc.moveDown(4);

    /* =========================
       TOTAL
    ========================= */
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#111827")
      .text("Total Paid:", { continued: true })
      .text(
        ` $${enrollment.amount || course?.price || "0"}`,
        { align: "right" }
      );

    doc.moveDown(2);

    /* =========================
       PAYMENT INFO
    ========================= */
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#111827")
      .text("Payment Information");

    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#374151")
      .text(`Method: ${enrollment.paymentGateway || "SSLCommerz"}`)
      .text(`Transaction ID: ${enrollment.paymentId || "N/A"}`)
      .text(`Status: ${enrollment.paymentStatus}`);

    doc.moveDown(3);

    /* =========================
       FOOTER
    ========================= */
    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text(
        "Thank you for learning with E-Learnify.\nThis invoice was generated automatically.",
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("Invoice error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

/* =========================
   CHECK INVOICE
========================= */
exports.checkInvoice = async (req, res) => {
  const { enrollmentId } = req.params;
  const userId = req.user.id;

  const enrollment = await getDb()
    .collection("enrollments")
    .findOne({ _id: new ObjectId(enrollmentId) });

  if (!enrollment) return res.status(404).json({ success: false });
  if (enrollment.userId.toString() !== userId)
    return res.status(403).json({ success: false });

  res.json({
    success: true,
    hasInvoice: enrollment.paymentStatus === "completed",
  });
};

/* =========================
   EXTRA
========================= */
exports.testInvoice = (req, res) => {
  res.json({ ok: true });
};

exports.downloadInvoiceSimple = exports.downloadInvoice;
