const express = require('express');
const { getTotalInfoController, adminLoginController } = require('../controller/adminHomeController');

const adminHomeRouter = express.Router();


adminHomeRouter.get('/blog/info', getTotalInfoController);
adminHomeRouter.post('/login', adminLoginController);

module.exports = adminHomeRouter;