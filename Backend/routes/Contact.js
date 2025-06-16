// backend/routes/Contact.js
const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../services/emailService');

router.post('/api/contact', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'email', 'message'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Send email
    await sendContactEmail(formData);

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully'
    });
  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request'
    });
  }
});

module.exports = router; // Export the router
