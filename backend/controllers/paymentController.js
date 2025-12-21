const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const SSLCommerzPayment = require('sslcommerz-lts');

// Initialize SSLCommerz
const sslcz = new SSLCommerzPayment(
  process.env.SSLCOMMERZ_STORE_ID,
  process.env.SSLCOMMERZ_STORE_PASSWORD,
  process.env.SSLCOMMERZ_IS_LIVE === 'true'
);

// Initiate payment
exports.initiatePayment = async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    const userId = req.user.userId;
    
    const db = getDB();
    const enrollmentsCollection = db.collection('enrollments');
    
    // Get enrollment details
    const enrollment = await enrollmentsCollection.findOne({
      _id: new ObjectId(enrollmentId),
      studentId: new ObjectId(userId)
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    if (enrollment.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Payment already completed' });
    }
    
    // Generate unique transaction ID
    const tran_id = 'EL' + Date.now() + Math.floor(Math.random() * 1000);
    
    // Payment data
    const data = {
      total_amount: enrollment.coursePrice,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `http://localhost:5000/api/payments/success`,
      fail_url: `http://localhost:5000/api/payments/fail`,
      cancel_url: `http://localhost:5000/api/payments/cancel`,
      ipn_url: `http://localhost:5000/api/payments/ipn`,
      product_name: enrollment.courseTitle,
      product_category: 'Education',
      product_profile: 'non-physical-goods',
      cus_name: enrollment.studentName,
      cus_email: enrollment.studentEmail,
      cus_phone: '01700000000',
      cus_add1: 'Dhaka',
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      shipping_method: 'NO',
      value_a: enrollmentId, // Store enrollment ID
      value_b: userId
    };
    
    // Save transaction info
    await enrollmentsCollection.updateOne(
      { _id: new ObjectId(enrollmentId) },
      { 
        $set: { 
          transactionId: tran_id,
          updatedAt: new Date()
        } 
      }
    );
    
    // Initialize payment
    const apiResponse = await sslcz.init(data);
    
    if (apiResponse.status === 'SUCCESS') {
      res.json({
        message: 'Payment initiated',
        paymentUrl: apiResponse.GatewayPageURL
      });
    } else {
      res.status(400).json({
        message: 'Payment initiation failed',
        error: apiResponse
      });
    }
    
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Payment success callback
exports.paymentSuccess = async (req, res) => {
  try {
    const { tran_id, val_id, value_a } = req.body; // value_a = enrollmentId
    
    const db = getDB();
    const enrollmentsCollection = db.collection('enrollments');
    const coursesCollection = db.collection('courses');
    const invoicesCollection = db.collection('invoices');
    
    // Verify payment with SSLCommerz
    const validation = await sslcz.validate({ val_id });
    
    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      // Update enrollment status
      const enrollment = await enrollmentsCollection.findOne({
        _id: new ObjectId(value_a)
      });
      
      await enrollmentsCollection.updateOne(
        { _id: new ObjectId(value_a) },
        { 
          $set: { 
            paymentStatus: 'completed',
            validationId: val_id,
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
          } 
        }
      );
      
      // Create invoice
      const invoice = {
        invoiceNumber: 'INV' + Date.now(),
        enrollmentId: new ObjectId(value_a),
        studentId: new ObjectId(enrollment.studentId),
        courseId: new ObjectId(enrollment.courseId),
        amount: enrollment.coursePrice,
        transactionId: tran_id,
        validationId: val_id,
        paymentMethod: 'SSLCommerz',
        status: 'paid',
        createdAt: new Date()
      };
      
      await invoicesCollection.insertOne(invoice);
      
      // Redirect to success page
      res.redirect(`http://localhost:3000/payment-success?enrollment=${value_a}`);
    } else {
      res.redirect(`http://localhost:3000/payment-failed`);
    }
    
  } catch (error) {
    console.error('Payment success error:', error);
    res.redirect(`http://localhost:3000/payment-failed`);
  }
};

// Payment fail callback
exports.paymentFail = async (req, res) => {
  try {
    const { value_a } = req.body; // enrollmentId
    
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
    
    res.redirect(`http://localhost:3000/payment-failed`);
    
  } catch (error) {
    console.error('Payment fail error:', error);
    res.redirect(`http://localhost:3000/payment-failed`);
  }
};

// Payment cancel callback
exports.paymentCancel = async (req, res) => {
  try {
    const { value_a } = req.body; // enrollmentId
    
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
    
    res.redirect(`http://localhost:3000/payment-cancelled`);
    
  } catch (error) {
    console.error('Payment cancel error:', error);
    res.redirect(`http://localhost:3000/payment-cancelled`);
  }
};