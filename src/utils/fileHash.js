const path = require('path');
const crypto = require('crypto');
const fs = require('fs')


function calculateHash(filePath, algorithm = 'sha256') {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const stream = fs.createReadStream(filePath);

        stream.on('data', (data) => {
            hash.update(data);
        });

        stream.on('end', () => {
            resolve(hash.digest('hex'));
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

async function renameFileWithHash(filePath) {
    try {
        const fileDir = path.dirname(filePath);
        const fileName = path.basename(filePath);
        const fileExtension = path.extname(fileName);
        const baseName = path.basename(fileName, fileExtension);
        
        const hashValue = await calculateHash(filePath);
        const newFileName = `${hashValue}${fileExtension}`;
        const newFilePath = path.join(fileDir, newFileName);

        // 重命名文件
        fs.renameSync(filePath, newFilePath);
        return newFilePath;
    } catch (error) {
        console.error("发生错误:", error);
    }
}

module.exports = renameFileWithHash;
