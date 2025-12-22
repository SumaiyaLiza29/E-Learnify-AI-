const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const { authenticate } = require("../middleware/auth");

// JSON check (needs auth)
router.get("/:enrollmentId", authenticate, invoiceController.getInvoice);

// 🔥 PDF DOWNLOAD (NO AUTH – because window.open can't send headers)
router.get(
  "/download/:enrollmentId",
  invoiceController.downloadInvoice
);

module.exports = router;
