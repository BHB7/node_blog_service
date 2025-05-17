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
const { check, validationResult } = require('express-validator');


const userRouter = express.Router();


userRouter.get('/', [
    check('uid')
], getUserByIdController);
userRouter.get('/info/:uid', getUserByIdController);
userRouter.get('/admin/info', getAdminController);

userRouter.post('/login', [
    check('name'),
    check('password')
], loginController);

userRouter.post('/signup', [
      check('name').isLength({min: 2}),
    check('password').isLength({min: 4})
], signupController);

userRouter.all('/sendCode', sendCodeController);
userRouter.get('/getIpInfo', getIpAddressController);
//  更新
userRouter.put('/put', updateUserInfoController);
module.exports = userRouter