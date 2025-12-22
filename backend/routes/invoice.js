// routes/invoice.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { authenticate } = require('../middleware/auth');

// Get invoice details
router.get('/:enrollmentId', authenticate, invoiceController.getInvoice);

// Download invoice PDF
router.get('/:enrollmentId/download', authenticate, invoiceController.downloadInvoice);

module.exports = router;