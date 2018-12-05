const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: 'AKIAJ6FDVKKPWTY6GEEQ',
    secretAccessKey: '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'
});

module.exports = s3;