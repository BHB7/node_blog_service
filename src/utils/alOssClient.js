const OSS = require('ali-oss')
const {config} = require('./getConfig')

const client = new OSS({
     // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
  accessKeyId: config.OSS.AccessKey_id,
  accessKeySecret: config.OSS.AccessKey_Secret,
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: config.OSS.Endpoint,
  authorizationV4: true,
  // yourBucketName填写Bucket名称。
  bucket: config.OSS.Bucket,
});

module.exports = client;