const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");
 
const {config} = require('./getConfig')
const s3 = new S3Client({
  endpoint: `https://${config.OSS.ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: "apac",
  credentials: {
    accessKeyId: config.OSS.access_key_id,
    secretAccessKey: config.OSS.secretAccessKey,
  },
  forcePathStyle: true,
  requestChecksumRequired: false,
  responseChecksumRequired: false,
});

module.exports = s3;

  