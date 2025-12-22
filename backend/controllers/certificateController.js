const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// GET /api/certificates/my
exports.getMyCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const db = getDB();

    const certs = await db
      .collection("certificates")
      .find({ userId: new ObjectId(userId) })
      .sort({ issuedAt: -1 })
      .toArray();

    res.json(certs);
  } catch (error) {
    console.error("Get certificates error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const PDFDocument = require("pdfkit");

exports.generateCertificatePDF = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const db = getDB();

    const cert = await db.collection("certificates").findOne({
      enrollmentId: new ObjectId(enrollmentId),
    });

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename=certificate-${enrollmentId}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(26).text("Certificate of Completion", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(16).text(`This certifies that`, { align: "center" });
    doc.moveDown();

    doc.fontSize(20).text(cert.studentName, { align: "center" });
    doc.moveDown();

    doc.fontSize(16).text(
      `has successfully completed the course`,
      { align: "center" }
    );
    doc.moveDown();

    doc.fontSize(18).text(cert.courseTitle, { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12).text(
      `Issued on: ${new Date(cert.issuedAt).toDateString()}`,
      { align: "center" }
    );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "PDF generation failed" });
  }
};

