const express = require('express');
const {
    getUserAll, 
    loginController, 
    signupController, 
    sendCodeController
} = require('../controller/userController');

const userRouter = express.Router();


userRouter.get('/', getUserAll);

userRouter.post('/login', loginController);

userRouter.post('/signup', signupController);

userRouter.all('/sendCode', sendCodeController);

module.exports = userRouter