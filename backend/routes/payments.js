// routes/payments.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// Payment routes
router.post("/init", authenticate, paymentController.initiatePayment);

// SSLCommerz callback routes - handle both GET and POST
router.post("/success", paymentController.paymentSuccess);
router.get("/success", paymentController.paymentSuccess);

router.post("/fail", paymentController.paymentFail);
router.get("/fail", paymentController.paymentFail);

router.post("/cancel", paymentController.paymentCancel);
router.get("/cancel", paymentController.paymentCancel);

// IPN route (SSLCommerz server-to-server)
router.post("/ipn", express.urlencoded({ extended: true }), paymentController.paymentIPN);

module.exports = router;