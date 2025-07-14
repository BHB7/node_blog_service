const express = require('express');
const { addHomeDataController, delHomeDataController, getHomeDataListController } = require('../controller/homeListController');

const homeListRouter = express.Router();


homeListRouter.post('/add', addHomeDataController);

homeListRouter.delete('/del', delHomeDataController);
homeListRouter.post('/list', getHomeDataListController);


module.exports = homeListRouter;