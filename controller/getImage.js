const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event, context) => {
  
    let params = {
    Bucket: process.env.S3_BUCKET_NAME,
  };

  try {

    let data = await s3.listObjects(params).promise();
    let sortedObjects = data.Contents.sort((a, b) => b.LastModified - a.LastModified);

    if (sortedObjects.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No images found in the bucket' }),
      };
    }

    let latestObject = sortedObjects[0];
    
    let getObjectParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: latestObject.Key,
    };

    let imageData = await s3.getObject(getObjectParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(imageData.Body.toString('base64')),
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'image/png',
      },
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 400,
      body: JSON.stringify(err.message),
    };
  }
};
