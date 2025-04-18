const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
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
async function put (dir) {
    const filename = path.basename(dir)
    const pathStr = path.join(__dirname, dir)
    try {
      const fileStream = fs.createReadStream(pathStr);  // 使用流上传
      const mimeType = getMimeType(pathStr);  // 获取 MIME 类型
      const command = new PutObjectCommand({
        Bucket: config.OSS.bucket,  // 指定你的 bucket 名
        Key: `web/${filename}`,            // 文件在 bucket 中的路径
        Body: fileStream,   // 文件内容
        ContentType: mimeType, // 设置 MIME 类型
      });
      const data = await s3.send(command);
      // 获取文件的 URL
      const fileUrl = `https://${config.OSS.cn}/web/${filename}`;
      return {
        url: fileUrl
      }
    } catch (err) {
      console.log('上传文件失败',err.message);
      
      throw new Error('上传文件失败啦')
    }
  }

/**
 * 删除指定文件
 * @param {string} filename 文件名
 */
async function delFile(filename) {
   
  }

module.exports = {
    put,
    delFile
}