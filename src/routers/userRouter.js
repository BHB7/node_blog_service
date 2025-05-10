const express = require('express');
const {
    getUserByIdController, 
    loginController, 
    signupController, 
    sendCodeController,
    getIpAddressController,
    updateUserInfoController,
    getAdminController
} = require('../controller/userController');

const userRouter = express.Router();


userRouter.get('/', getUserByIdController);
userRouter.get('/info/:uid', getUserByIdController);
userRouter.get('/admin/info', getAdminController);

userRouter.post('/login', loginController);

userRouter.post('/signup', signupController);

userRouter.all('/sendCode', sendCodeController);
userRouter.get('/getIpInfo', getIpAddressController);
//  更新
userRouter.put('/put', updateUserInfoController);
module.exports = userRouter