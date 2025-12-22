const { ObjectId } = require("mongodb");
const { getDb } = require("../config/db");
const PDFDocument = require("pdfkit");

/* =========================
   GET INVOICE (JSON) – AUTH REQUIRED
========================= */
const getInvoice = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.id;

    const db = getDb();
    const enrollments = db.collection("enrollments");

    const enrollment = await enrollments.findOne({
      _id: new ObjectId(enrollmentId),
      userId: new ObjectId(userId),
    });

    if (!enrollment) {
      return res.status(404).json({ success: false });
    }

    if (enrollment.paymentStatus !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({ success: false });
  }
};

/* =========================
   DOWNLOAD INVOICE (PDF)
   ⚠️ NO AUTH HEADER (window.open safe)
========================= */
const downloadInvoice = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const db = getDb();
    const enrollments = db.collection("enrollments");
    const courses = db.collection("courses");
    const users = db.collection("users");

    const enrollment = await enrollments.findOne({
      _id: new ObjectId(enrollmentId),
      paymentStatus: "completed",
    });

    if (!enrollment) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const course = await courses.findOne({
      _id: new ObjectId(enrollment.courseId),
    });

    const user = await users.findOne({
      _id: new ObjectId(enrollment.userId),
    });

    // 🔹 Narrow page (receipt-like)
    const doc = new PDFDocument({
      size: [300, 500],
      margin: 20,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${enrollmentId}.pdf`
    );

    doc.pipe(res);

    /* =========================
       HEADER
    ========================= */
    doc.font("Helvetica-Bold").fontSize(14).text("E-Learnify", {
      align: "center",
    });

    doc.font("Helvetica").fontSize(9).text(
      "Online Learning Platform",
      { align: "center" }
    );

    doc.moveDown();

    doc.font("Helvetica-Bold").fontSize(12).text("INVOICE", {
      align: "center",
    });

    doc.moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("PAID", { align: "center" });

    doc.moveDown();

    /* =========================
       META
    ========================= */
    doc.font("Helvetica").fontSize(9);
    doc.text(`Invoice No: INV-${enrollmentId.slice(-6).toUpperCase()}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown();

    /* =========================
       CUSTOMER
    ========================= */
    doc.font("Helvetica-Bold").text("Billed To");
    doc.font("Helvetica").text(user?.name || "Student");
    doc.text(user?.email || "student@example.com");

    doc.moveDown();

    /* =========================
       LINE
    ========================= */
    doc.moveTo(20, doc.y).lineTo(280, doc.y).stroke();
    doc.moveDown(0.5);

    /* =========================
       COURSE
    ========================= */
    doc.font("Helvetica-Bold").text("Course");
    doc.font("Helvetica").text(course?.title || "Online Course");

    doc.moveDown();

    /* =========================
       AMOUNT
    ========================= */
    doc.font("Helvetica-Bold").text("Amount Paid");
    doc.font("Helvetica").text(
      `${enrollment.amount || course?.price || 0} BDT`
    );

    doc.moveDown();

    /* =========================
       PAYMENT INFO
    ========================= */
    doc.font("Helvetica-Bold").text("Payment Details");
    doc.font("Helvetica").text("Method: SSLCommerz");
    doc.text(`Transaction ID: ${enrollment.paymentId || "N/A"}`);

    doc.moveDown();

    /* =========================
       FOOTER
    ========================= */
    doc.moveTo(20, doc.y).lineTo(280, doc.y).stroke();
    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(
        "This is a system generated invoice.\nNo signature required.",
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("Invoice PDF error:", error);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};


module.exports = {
  getInvoice,
  downloadInvoice,
};
