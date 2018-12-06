const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: '***************',
    secretAccessKey: '**********************'
});

module.exports = s3;
