const { put } = require('../utils/opOssFile');
const path = require('path');
const fs = require('fs');
const util = require('util')
const unlink = util.promisify(fs.unlink);
const renameFileWithHash = require('../utils/fileHash');
const putController = async (req, res) => {
    try {
        if (!req.file) res.error('没有接收到文件');
        const filePath = await renameFileWithHash(path.join(req.file.path));
        const url = await put(filePath);
         await unlink(filePath);
        res.success(url,'上传成功');
    } catch (err) {
        res.error(err.message);
    }
};



module.exports = {
    putController
}