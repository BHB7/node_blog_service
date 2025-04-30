const express = require('express');
const { createArticleController,
    updateArticleController,
    getArticlePageController,
    getArticleControllerById,
    delArticleController,
} = require('../controller/articleController');
const articleRouter = express();

articleRouter.post('/post', createArticleController);
articleRouter.put('/update', updateArticleController);
articleRouter.all('/list', getArticlePageController);
articleRouter.get('/:aid', getArticleControllerById);
articleRouter.delete('/:aid', delArticleController);
module.exports = articleRouter;