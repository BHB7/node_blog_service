const express = require('express');
const { putController } = require('../controller/uploadController');
const multer = require('multer');
const path = require('path')
const fs = require('fs')

// 确保目录存在
const dir = path.resolve(__dirname, '../public/image')
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

// multer 配置
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, dir)
  },
  filename(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

const uploadRouter = express.Router();


uploadRouter.post('/put',upload.single('file'), putController);


module.exports = uploadRouter