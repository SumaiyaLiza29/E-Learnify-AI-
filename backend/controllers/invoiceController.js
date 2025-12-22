// controllers/invoiceController.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate and download invoice
exports.downloadInvoice = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.userId;
    
    const db = getDB();
    const invoicesCollection = db.collection('invoices');
    const enrollmentsCollection = db.collection('enrollments');
    
    // Find invoice for this enrollment and user
    const invoice = await invoicesCollection.findOne({
      enrollmentId: new ObjectId(enrollmentId),
      studentId: new ObjectId(userId)
    });
    
    if (!invoice) {
      return res.status(404).json({ 
        success: false,
        message: 'Invoice not found' 
      });
    }
    
    // Get enrollment details
    const enrollment = await enrollmentsCollection.findOne({
      _id: new ObjectId(enrollmentId)
    });
    
    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
    
    // Pipe PDF to response
    doc.pipe(res);
    
    // Add content to PDF
    // Header
    doc.fontSize(25).text('E-Learnify', { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    // Invoice details
    doc.fontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Date: ${invoice.createdAt.toLocaleDateString()}`);
    doc.moveDown();
    
    // Line
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();
    
    // Student info
    doc.text('Bill To:', { underline: true });
    doc.text(`Name: ${invoice.studentName}`);
    doc.text(`Email: ${invoice.studentEmail}`);
    doc.moveDown();
    
    // Course info
    doc.text('Course Details:', { underline: true });
    doc.text(`Course: ${invoice.courseTitle}`);
    doc.text(`Enrollment ID: ${enrollmentId}`);
    doc.moveDown();
    
    // Payment details table
    const tableTop = doc.y;
    
    // Table headers
    doc.text('Description', 50, tableTop, { width: 250 });
    doc.text('Amount (BDT)', 400, tableTop, { width: 150, align: 'right' });
    
    doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown();
    
    // Table row
    const rowTop = doc.y;
    doc.text(invoice.courseTitle, 50, rowTop, { width: 250 });
    doc.text(`৳ ${invoice.amount.toFixed(2)}`, 400, rowTop, { width: 150, align: 'right' });
    
    doc.moveTo(50, doc.y + 20).lineTo(550, doc.y + 20).stroke();
    doc.moveDown(2);
    
    // Total
    doc.text('Total:', 400, doc.y, { width: 150, align: 'right', underline: true });
    doc.text(`৳ ${invoice.amount.toFixed(2)}`, 400, doc.y + 20, { width: 150, align: 'right', bold: true });
    
    doc.moveDown(3);
    
    // Payment status
    doc.text(`Payment Status: ${invoice.status.toUpperCase()}`, { align: 'center' });
    doc.text(`Payment Method: ${invoice.paymentMethod}`, { align: 'center' });
    doc.text(`Transaction ID: ${invoice.transactionId}`, { align: 'center' });
    
    doc.moveDown(2);
    
    // Footer
    doc.fontSize(10).text('Thank you for your purchase!', { align: 'center' });
    doc.text('E-Learnify - Online Learning Platform', { align: 'center' });
    
    // Finalize PDF
    doc.end();
    
  } catch (error) {
    console.error('Invoice download error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate invoice',
      error: error.message 
    });
  }
};

// Get invoice details
exports.getInvoice = async (req, res) => {
  try {
    const { enrollmentId } = req.params;
    const userId = req.user.userId;
    
    const db = getDB();
    const invoicesCollection = db.collection('invoices');
    
    const invoice = await invoicesCollection.findOne({
      enrollmentId: new ObjectId(enrollmentId),
      studentId: new ObjectId(userId)
    });
    
    if (!invoice) {
      return res.status(404).json({ 
        success: false,
        message: 'Invoice not found' 
      });
    }
    
    res.json({
      success: true,
      invoice: {
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        paymentMethod: invoice.paymentMethod,
        status: invoice.status,
        transactionId: invoice.transactionId,
        createdAt: invoice.createdAt,
        courseTitle: invoice.courseTitle
      }
    });
    
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get invoice',
      error: error.message 
    });
  }
};