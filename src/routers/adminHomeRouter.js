const express = require('express');
const { getTotalInfoController } = require('../controller/adminHomeController');

const adminHomeRouter = express.Router();


adminHomeRouter.get('/', getTotalInfoController);


module.exports = adminHomeRouter;