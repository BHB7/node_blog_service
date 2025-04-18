const express = require('express');
const { getTagController, createTagController, deleteTagController } = require('../controller/tagController');
const tagRouter = express.Router();




tagRouter.all('/', getTagController);

tagRouter.all('/add', createTagController);

tagRouter.all('/del', deleteTagController);


module.exports = tagRouter;