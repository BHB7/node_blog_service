const { put } = require('../utils/uploadFile');
const path = require('path');
const fs = require('fs');
const util = require('util')
const unlink = util.promisify(fs.unlink);
const putController = async (req, res) => {
    try {
        const url = await put(path.join('../../', req.file.path))
         await unlink(path.join(__dirname,'../../', req.file.path))
        res.success(url);
    } catch (err) {
        res.error(err.message)
    }
}



module.exports = {
    putController
}