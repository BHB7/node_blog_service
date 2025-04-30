const express = require('express');
const { getUniqueIdController } = require('../controller/cacheController');

const cacheRouter = express.Router();


// 生成uuid 并存入 缓存 redis
cacheRouter.get('/uuid', getUniqueIdController);


module.exports = cacheRouter;