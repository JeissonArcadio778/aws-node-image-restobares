// models/Image.js

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  uploader: String,
  url: String,
  uploadDate: Date,
});

module.exports = mongoose.model('Image', imageSchema);
