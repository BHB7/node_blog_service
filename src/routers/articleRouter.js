const express = require('express');
const { createArticleController, updateArticleController } = require('../controller/articleController');
const articleRouter = express();



articleRouter.post('/post', createArticleController);

articleRouter.put('/update', updateArticleController);

module.exports = articleRouter;