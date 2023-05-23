// lambdas/getImagesByDate.js

const mongoose = require('mongoose');
const Image = require('../models/image');

exports.handler = async (event, context) => {
  let body = JSON.parse(event.body);
  let { startDate, endDate } = body;

  startDate = new Date(startDate);
  endDate = new Date(endDate);

  let images = await Image.find({
    uploadDate: {
      $gte: startDate,
      $lt: endDate
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(images),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };
  
};
