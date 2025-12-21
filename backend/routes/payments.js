const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");

// TEMP test route
router.post("/init", authenticate, (req, res) => {
  res.json({
    message: "Payment initialized (placeholder)",
  });
});

router.post("/success", (req, res) => {
  res.send("Payment success callback");
});

router.post("/fail", (req, res) => {
  res.send("Payment failed");
});

router.post("/cancel", (req, res) => {
  res.send("Payment cancelled");
});

module.exports = router;
