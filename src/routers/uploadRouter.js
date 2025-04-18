const express = require('express');
const { putController } = require('../controller/uploadController');

const uploadRouter = express.Router();


uploadRouter.post('/put', putController);


module.exports = uploadRouter