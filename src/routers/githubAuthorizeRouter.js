const express = require('express');
const { githubAuthorizeLoginController, githubAuthorizeCallbackController } = require('../controller/githubAuthorizeController');

const githubAuthorizeRouter = express.Router();

// 登录
githubAuthorizeRouter.get('/login', githubAuthorizeLoginController);
// 登录授权完成的回调地址
githubAuthorizeRouter.get('/callback', githubAuthorizeCallbackController)


module.exports = githubAuthorizeRouter;