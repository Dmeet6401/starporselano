// backend/routes/Contact.js
const express = require('express');
const sendEmail = require('../services/sendEmail'); // Use require

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    await sendEmail(req.body); // Call the sendEmail function
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router; // Export the router
