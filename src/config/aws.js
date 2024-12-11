const AWS = require('aws-sdk');
require('dotenv').config();

const awsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  bucket: process.env.AWS_S3_BUCKET,
  useAccelerateEndpoint: true
};

// AWS SDK 설정
AWS.config.update(awsConfig);

// S3 클라이언트 생성
const s3 = new AWS.S3();

module.exports = {
  s3,
  awsConfig
};