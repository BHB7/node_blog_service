const express = require('express');
const { giteeAuthorizeLoginController, giteeAuthorizeCallbackController } = require('../controller/giteeAuthorizeController');

const giteeAuthorizeRouter = express.Router();


// 返回授权链接
giteeAuthorizeRouter.get('/login/redirect', giteeAuthorizeLoginController);


// 登录授权完成的回调地址
giteeAuthorizeRouter.get('/login/callback', giteeAuthorizeCallbackController);

module.exports = giteeAuthorizeRouter;