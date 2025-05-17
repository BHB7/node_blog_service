const express = require('express');
const { addCommentController, delCommentController, getCommentsController } = require('../controller/commentController');  

const commentRouter = express.Router();

commentRouter.delete('/del/:cid', delCommentController);

commentRouter.post('/add', addCommentController);

commentRouter.get('/list', getCommentsController);

module.exports = commentRouter;