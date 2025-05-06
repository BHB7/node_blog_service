const express = require('express');
const {
    getUserByIdController, 
    loginController, 
    signupController, 
    sendCodeController,
    getIpAddressController,
    updateUserInfoController
} = require('../controller/userController');

const userRouter = express.Router();


userRouter.get('/info/:uid', getUserByIdController);

userRouter.post('/login', loginController);

userRouter.post('/signup', signupController);

userRouter.all('/sendCode', sendCodeController);
userRouter.get('/getIpInfo', getIpAddressController);
//  更新
userRouter.put('/put', updateUserInfoController);
module.exports = userRouter