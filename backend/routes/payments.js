const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticate } = require("../middleware/auth");

// INITIATE PAYMENT
router.post("/init", authenticate, paymentController.initiatePayment);

// SSLCommerz CALLBACKS (GET + POST দুটোই allow)
router.get("/success", paymentController.paymentSuccess);
router.post("/success", paymentController.paymentSuccess);

router.get("/fail", paymentController.paymentFail);
router.post("/fail", paymentController.paymentFail);

router.get("/cancel", paymentController.paymentCancel);
router.post("/cancel", paymentController.paymentCancel);

// IPN
router.post("/ipn", express.urlencoded({ extended: true }), paymentController.paymentIPN);

// INVOICE
router.get(
  "/invoice/:enrollmentId",
  authenticate,
  paymentController.downloadInvoice
);

router.get(
  "/invoice-check/:enrollmentId",
  authenticate,
  paymentController.checkInvoice
);

module.exports = router;
