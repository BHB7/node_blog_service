const express = require('express');
const { searchController } = require('../controller/musicController');

const musicRouter = express.Router();


musicRouter.get('/search', searchController);


module.exports = {
    musicRouter
}