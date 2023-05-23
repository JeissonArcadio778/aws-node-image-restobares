const multer = require('multer');
const sharp = require('sharp');
const AWS = require('aws-sdk');

const Image = require('../models/image');

const upload = multer({ storage: multer.memoryStorage() });

const s3 = new AWS.S3();

exports.uploadImage = upload.single('image');

exports.processImage = async (req, res, next) => {
  
  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded',
    });
  }

  // Check if the file is an image
  const mimetype = req.file.mimetype;

  const allowedMimetypes = ['image/jpg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'];

  if (!allowedMimetypes.includes(mimetype)) {
    return res.status(400).json({
      message: 'Invalid file format. Please upload an image file.',
    });
  }

  try {
    const pngImage = await sharp(req.file.buffer).toFormat('png').toBuffer();
    req.pngImage = pngImage;
    next();
  } catch (err) {
    console.error(`Error processing image: ${err}`);
    return res.status(400).json({
      message: 'Error processing image',
      error: err.message
    });
  }
};



exports.saveToS3 = async (req, res, next) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}.png`,
    Body: req.pngImage,
    ContentType: 'image/png',
    ACL: 'public-read',
  };

  try {
    const response = await s3.upload(params).promise();
    req.imageLocation = response.Location;
    next();
  } catch (err) {
    next(err);
  }
};

exports.saveToDb = async (req, res) => {
  const image = new Image({
    uploader: req.body.uploader,
    url: req.imageLocation,
    uploadDate: new Date(),
  });

  await image.save();

  res.status(200).send({ url: req.imageLocation });
};
