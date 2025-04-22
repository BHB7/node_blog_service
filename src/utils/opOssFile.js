const { PutObjectCommand, DeleteBucketCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const path = require('node:path')
const s3 = require('./awsOss');
const { config } = require('./getConfig');
const fs = require('node:fs');





// 自动根据文件扩展名获取 MIME 类型（如: .txt -> text/plain, .jpg -> image/jpeg）
const getMimeType = (filePath) => {
  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/vnd.microsoft.icon',
    '.pdf': 'application/pdf',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.csv': 'text/csv',
    '.ts': 'application/typescript',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.zip': 'application/zip',
    '.tar': 'application/x-tar',
    '.gz': 'application/gzip',
    '.7z': 'application/x-7z-compressed',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
    '.avi': 'video/x-msvideo',
    '.mkv': 'video/x-matroska',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.flac': 'audio/flac',
    '.aac': 'audio/aac',
    '.midi': 'audio/midi',
    '.xml': 'application/xml',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.doc': 'application/msword',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.exe': 'application/x-msdownload',
    '.apk': 'application/vnd.android.package-archive',
    '.iso': 'application/x-iso9660-image',
    '.psd': 'image/vnd.adobe.photoshop',
    '.rar': 'application/x-rar-compressed',
    '.jsonl': 'application/jsonlines',
    '.yaml': 'application/x-yaml',
    '.yml': 'application/x-yaml',
    '.md': 'text/markdown',
    '.rtf': 'application/rtf',
    '.epub': 'application/epub+zip',
    '.mobi': 'application/x-mobipocket-ebook',
  };
  return mimeTypes[extname] || 'application/octet-stream';  // 默认使用 'application/octet-stream'
};
/**
 * 文件上传
 * @param {string} dir 本地文件路径 
 */
async function put(dir) {
  
  const filename = path.basename(dir)
  const pathStr = path.isAbsolute(dir) ? dir : path.join(__dirname, dir)
  console.log('接收上传路径：', pathStr)

  try {
    const fileStream = fs.createReadStream(pathStr)
    const mimeType = getMimeType(pathStr)
    const command = new PutObjectCommand({
      Bucket: config.OSS.bucket,
      Key: `web/${filename}`,
      Body: fileStream,
      ContentType: mimeType,
    })

    const data = await s3.send(command)

    const fileUrl = `https://${config.OSS.cn}/web/${filename}`
    return { url: fileUrl }

  } catch (err) {
    console.log('上传文件失败', err.message)
    throw new Error('上传文件失败啦')
  }
}


/**
 * 删除指定文件
 * @param {string} filename 文件名
 */
async function delFile(filename) {

  try {
    const command = new DeleteBucketCommand({
      Bucket: config.OSS.bucket,
      Key: `web/${filename}`
    })
    await s3.send(command);
    return true;
  } catch (error) {
    console.log('删除文件失败：', error.message);
    throw new Error("删除文件失败");

  }
}


const bucketInfo = async () => {
  const command = new ListObjectsV2Command({
    Bucket: config.OSS.bucket,
    Prefix: "web/",
  });

  let fileSzieTotal = 0;
  const res = await s3.send(command);
  res.Contents.forEach(item => {
    fileSzieTotal += item.Size / 1024 / 1024;
  })
  return {
    list: res.Contents,
    total: Math.round(fileSzieTotal)
  };
};

module.exports = {
  put,
  delFile,
  bucketInfo
}