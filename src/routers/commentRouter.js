const express = require('express');
const { addCommentController, delCommentController } = require('../controller/commentController');  

const commentRouter = express.Router();

commentRouter.delete('/del/:cid', delCommentController);

commentRouter.post('/add', addCommentController);



module.exports = commentRouter;