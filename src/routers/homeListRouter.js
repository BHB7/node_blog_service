const express = require('express');
const { addHomeDataController, delHomeDataController, getHomeDataListController, setHomeListStateController, updateHomeListController } = require('../controller/homeListController');

const homeListRouter = express.Router();


homeListRouter.post('/add', addHomeDataController);

homeListRouter.delete('/del', delHomeDataController);
homeListRouter.post('/list', getHomeDataListController);
homeListRouter.post('/remove', setHomeListStateController);
homeListRouter.post('/update', updateHomeListController);


module.exports = homeListRouter;