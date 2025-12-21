const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

exports.getMyCertificates = async (req, res) => {
  try {
    const userId = req.user.userId;
    const db = getDB();

    const certificates = await db
      .collection("enrollments")
      .find({
        studentId: new ObjectId(userId),
        progress: 100,
        certificateUrl: { $ne: null },
      })
      .project({
        courseTitle: 1,
        completionDate: 1,
        certificateUrl: 1,
      })
      .toArray();

    res.json(certificates);
  } catch (error) {
    console.error("Certificate fetch error:", error);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};
