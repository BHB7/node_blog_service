const express = require('express');
const {
    getUserByIdController, 
    loginController, 
    signupController, 
    sendCodeController
} = require('../controller/userController');

const userRouter = express.Router();


userRouter.get('/:uid', getUserByIdController);

userRouter.post('/login', loginController);

userRouter.post('/signup', signupController);

userRouter.all('/sendCode', sendCodeController);

module.exports = userRouter