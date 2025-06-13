const multer = require('multer');
const path = require('path');
const { uploadFileToImageKit } = require('../services/imageKitService');
const { Document } = require('../models'); // Assuming you have a Document model

// Set up multer for file handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Upload to 'uploads' directory (you can adjust)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Route for uploading the PDF
const uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    const fileUrl = await uploadFileToImageKit(file.path, file.originalname);

    // Save the URL to the database
    const document = await Document.create({
      title: req.body.title, // Add the title from the frontend form
      pdf_url: fileUrl,
    });

    res.status(200).json({
      message: 'PDF uploaded successfully!',
      document,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadPDF };
