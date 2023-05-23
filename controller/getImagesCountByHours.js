// controller/getImagesCountByHours.js

const Image = require('../models/image');

exports.handler = async (event, context) => {
  let images = await Image.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$uploadDate" },
          month: { $month: "$uploadDate" },
          day: { $dayOfMonth: "$uploadDate" },
          hour: { $hour: "$uploadDate" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  return {
    statusCode: 200,
    body: JSON.stringify(images),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  };
};
