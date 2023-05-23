const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const processImage = require('./controller/processImage');

mongoose.connect("mongodb+srv://jeissonarcadio:Medellin2014@miclusterpng.n6hccvb.mongodb.net/Images", { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

// Configurar CORS
app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post(
  '/upload',
  processImage.uploadImage,
  processImage.processImage,
  processImage.saveToS3,
  processImage.saveToDb
);

exports.handler = serverless(app);
