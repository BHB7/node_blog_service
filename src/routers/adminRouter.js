const express = require('express');
const { getTotalInfoController } = require('../controller/adminController');

const adminRouter = express.Router();


adminRouter.get('/', getTotalInfoController);


module.exports = adminRouter;