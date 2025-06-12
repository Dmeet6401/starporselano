// services/imageKitService.js
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadImage = async (file, fileName) => {
  try {
    const result = await imagekit.upload({
      file,       // can be base64, URL, or filepath
      fileName,   // desired file name
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadImage,
};
