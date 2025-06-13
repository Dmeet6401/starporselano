const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadPDF } = require('../controllers/ImageController');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // or use diskStorage if you want to save to disk
const upload = multer({ storage });

// Route for uploading PDF
router.post('/upload-pdf', upload.single('pdf'), uploadPDF);

module.exports = router;
