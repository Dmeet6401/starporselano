import multer from 'multer';
import ImageKit from 'imagekit';

const storage = multer.memoryStorage();
const upload = multer({
    storage
  });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
});

export const uploadPhoto = upload.single('file');
    
export const uploadToImageKit = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  try {
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname,
    });

    req.body.photo_url = result.url;
    return res.status(200).json({ message: 'Image uploaded successfully', url: result.url });

  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error: (error ).message });
  }
};