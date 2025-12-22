const express = require("express");
const router = express.Router();

const {
  getMyCertificates,
} = require("../controllers/certificateController");

const { authenticate } = require("../middleware/auth");

// ✅ ONLY THIS
router.get("/my", authenticate, getMyCertificates);

module.exports = router;
