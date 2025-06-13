// services/imageKitService.js
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const fs = require("fs");
const path = require("path");


const uploadFileToImageKit = async (filePath, fileName) => {
  try {
    const response = await imagekit.upload({
      file: fs.readFileSync(filePath),
      fileName: fileName,
      useUniqueFileName: true,  // Optional: to ensure unique names
    });
    return response.url;  // URL of the uploaded file
  } catch (error) {
    throw new Error("Error uploading file to ImageKit: " + error.message);
  }
};

module.exports = { uploadFileToImageKit };

