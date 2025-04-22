const { put } = require('../utils/opOssFile');
const path = require('path');
const fs = require('fs');
const util = require('util')
const unlink = util.promisify(fs.unlink);
const putController = async (req, res) => {
    try {
        if (!req.file) res.error('没有接收到文件');
        const url = await put(path.join(req.file.path));
         await unlink(path.join(req.file.path));
        res.success(url);
    } catch (err) {
        res.error(err.message);
    }
};



module.exports = {
    putController
}