// routes/ImageRoutes.js
const express = require("express");
const { uploadTileImage } = require("../controllers/ImageController");

const router = express.Router();

router.post("/upload", uploadTileImage);

module.exports = router;
