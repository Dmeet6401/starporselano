const express = require('express');
const router = express.Router();
const { uploadToImageKit,uploadPhoto } = require('../services/imageKitService');

// Route for uploading 
router.post('/upload', uploadPhoto,uploadToImageKit);

module.exports = router;
