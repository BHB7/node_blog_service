const express = require('express');
const { addFriendLinkController, getFriendLinkListController, updateFriendLinkController, setFriendLinkShowController } = require('../controller/friendLinksController');

const friendLinksRouter = express.Router();




friendLinksRouter.post('/add', addFriendLinkController);
friendLinksRouter.post('/update', updateFriendLinkController);
friendLinksRouter.post('/list', getFriendLinkListController);
friendLinksRouter.put('/isShow', setFriendLinkShowController);



module.exports = friendLinksRouter;