// controllers/ImageController.js
const { uploadImage } = require("../services/imageKitService");

const uploadTileImage = async (req, res) => {
  try {
    const { file, fileName } = req.body; // file should be base64, URL or path
    const result = await uploadImage(file, fileName);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { uploadTileImage };
