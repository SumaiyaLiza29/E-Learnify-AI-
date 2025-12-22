// controllers/paymentController.js
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const SSLCommerzPayment = require('sslcommerz-lts');

// Initialize SSLCommerz
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

console.log('SSLCommerz Config:', { store_id, store_passwd, is_live });

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

// Initiate payment
exports.initiatePayment = async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    const userId = req.user.userId;
    
    console.log('Initiating payment for:', { enrollmentId, userId });
    
    const db = getDB();
    const enrollmentsCollection = db.collection('enrollments');
    
    // Get enrollment details
    const enrollment = await enrollmentsCollection.findOne({
      _id: new ObjectId(enrollmentId),
      studentId: new ObjectId(userId)
    });
    
    if (!enrollment) {
      return res.status(404).json({ 
        success: false,
        message: 'Enrollment not found' 
      });
    }
    
    if (enrollment.paymentStatus === 'completed') {
      return res.status(400).json({ 
        success: false,
        message: 'Payment already completed' 
      });
    }
    
    // Generate unique transaction ID
    const tran_id = 'EL' + Date.now() + Math.floor(Math.random() * 1000);
    
    // Base URL - use your actual backend URL
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Payment data for SSLCommerz
    const data = {
      total_amount: enrollment.coursePrice || 100, // Default to 100 if not set
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `${baseUrl}/api/payments/success`,
      fail_url: `${baseUrl}/api/payments/fail`,
      cancel_url: `${baseUrl}/api/payments/cancel`,
      ipn_url: `${baseUrl}/api/payments/ipn`,
      product_name: enrollment.courseTitle || 'Course Enrollment',
      product_category: 'Education',
      product_profile: 'non-physical-goods',
      cus_name: enrollment.studentName || 'Customer',
      cus_email: enrollment.studentEmail || 'customer@example.com',
      cus_phone: '01700000000',
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      shipping_method: 'NO',
      multi_card_name: 'mastercard,visacard,amexcard', // Accept multiple cards
      value_a: enrollmentId.toString(),
      value_b: userId.toString(),
      value_c: enrollment.courseId.toString()
    };
    
    console.log('SSLCommerz payment data:', data);
    
    // Save transaction info
    await enrollmentsCollection.updateOne(
      { _id: new ObjectId(enrollmentId) },
      { 
        $set: { 
          transactionId: tran_id,
          paymentStatus: 'pending',
          updatedAt: new Date()
        } 
      }
    );
    
    // Initialize payment
    const apiResponse = await sslcz.init(data);
    console.log('SSLCommerz API Response:', apiResponse);
    
    if (apiResponse.status === 'SUCCESS') {
      res.json({
        success: true,
        message: 'Payment initiated',
        paymentUrl: apiResponse.GatewayPageURL,
        transactionId: tran_id
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment initiation failed',
        error: apiResponse.failedreason || 'Unknown error'
      });
    }
    
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Payment success callback (SSLCommerz redirects here)
exports.paymentSuccess = async (req, res) => {
  try {
    console.log('Payment success callback called');
    console.log('Request body:', req.body);
    console.log('Request query:', req.query);
    
    // SSLCommerz sends data via POST, but also might redirect with GET
    const data = req.method === 'POST' ? req.body : req.query;
    const { tran_id, val_id, value_a } = data; // value_a = enrollmentId
    
    console.log('Payment success data:', { tran_id, val_id, value_a });
    
    if (!value_a) {
      console.error('No enrollment ID in callback');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-failed?error=no_enrollment_id`);
    }
    
    const db = getDB();
    const enrollmentsCollection = db.collection('enrollments');
    const coursesCollection = db.collection('courses');
    const invoicesCollection = db.collection('invoices');
    
    // Find enrollment
    const enrollment = await enrollmentsCollection.findOne({
      _id: new ObjectId(value_a)
    });
    
    if (!enrollment) {
      console.error('Enrollment not found:', value_a);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-failed?error=enrollment_not_found`);
    }
    
    // If already completed, just redirect to success
    if (enrollment.paymentStatus === 'completed') {
      console.log('Payment already completed');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment-success?enrollment=${value_a}`);
    }
    
    // Update enrollment status
    await enrollmentsCollection.updateOne(
      { _id: new ObjectId(value_a) },
      { 
        $set: { 
          paymentStatus: 'completed',
          transactionId: tran_id,
          validationId: val_id || 'manual',
          paidAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );
    
    // Add student to course's enrolled students
    await coursesCollection.updateOne(
      { _id: new ObjectId(enrollment.courseId) },
      { 
        $addToSet: { 
          enrolledStudents: new ObjectId(enrollment.studentId) 
        },
        $inc: { totalEnrollments: 1 }
      }
    );
    
    // Create invoice
    const invoice = {
      invoiceNumber: 'INV' + Date.now(),
      enrollmentId: new ObjectId(value_a),
      studentId: new ObjectId(enrollment.studentId),
      courseId: new ObjectId(enrollment.courseId),
      amount: enrollment.coursePrice || 100,
      transactionId: tran_id || 'N/A',
      validationId: val_id || 'manual',
      paymentMethod: 'SSLCommerz',
      status: 'paid',
      studentName: enrollment.studentName,
      studentEmail: enrollment.studentEmail,
      courseTitle: enrollment.courseTitle,
      createdAt: new Date()
    };
    
    await invoicesCollection.insertOne(invoice);
    
    console.log('Payment successful for enrollment:', value_a);
    
    // Redirect to frontend success page
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/payment-success?enrollment=${value_a}&transaction=${tran_id}`);
    
  } catch (error) {
    console.error('Payment success error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/payment-failed?error=server_error`);
  }
};

// Payment fail callback
exports.paymentFail = async (req, res) => {
  try {
    console.log('Payment fail callback called');
    
    const data = req.method === 'POST' ? req.body : req.query;
    const { value_a } = data; // enrollmentId
    
    console.log('Payment fail data:', data);
    
    if (value_a) {
      const db = getDB();
      const enrollmentsCollection = db.collection('enrollments');
      
      await enrollmentsCollection.updateOne(
        { _id: new ObjectId(value_a) },
        { 
          $set: { 
            paymentStatus: 'failed',
            updatedAt: new Date()
          } 
        }
      );
      
      console.log('Payment failed for enrollment:', value_a);
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/payment-failed?enrollment=${value_a || ''}`);
    
  } catch (error) {
    console.error('Payment fail error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/payment-failed`);
  }
};

// Payment cancel callback
exports.paymentCancel = async (req, res) => {
  try {
    console.log('Payment cancel callback called');
    
    const data = req.method === 'POST' ? req.body : req.query;
    const { value_a } = data; // enrollmentId
    
    console.log('Payment cancel data:', data);
    
    if (value_a) {
      const db = getDB();
      const enrollmentsCollection = db.collection('enrollments');
      
      await enrollmentsCollection.updateOne(
        { _id: new ObjectId(value_a) },
        { 
          $set: { 
            paymentStatus: 'cancelled',
            updatedAt: new Date()
          } 
        }
      );
      
      console.log('Payment cancelled for enrollment:', value_a);
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/payment-cancelled?enrollment=${value_a || ''}`);
    
  } catch (error) {
    console.error('Payment cancel error:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/payment-cancelled`);
  }
};

// IPN (Instant Payment Notification) handler
exports.paymentIPN = async (req, res) => {
  try {
    console.log('IPN received:', req.body);
    
    // SSLCommerz sends IPN as form-urlencoded
    const paymentData = req.body;
    
    // Process IPN here if needed
    // Usually you don't need to do much since success/fail callbacks handle it
    
    res.status(200).send('IPN received');
    
  } catch (error) {
    console.error('IPN error:', error);
    res.status(500).send('IPN error');
  }
};