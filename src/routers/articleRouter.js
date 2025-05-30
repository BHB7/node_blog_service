const express = require('express');
const { createArticleController,
    updateArticleController,
    getArticlePageController
} = require('../controller/articleController');
const articleRouter = express();



articleRouter.post('/post', createArticleController);

articleRouter.put('/update', updateArticleController);

articleRouter.all('/', getArticlePageController);

module.exports = articleRouter;