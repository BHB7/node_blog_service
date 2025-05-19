const express = require('express');
const emojiRouter = express.Router();
const { addEmojiController, delEmojiController, getEmojiController } = require('../controller/emojiController');


emojiRouter.delete('/del/:eid', delEmojiController);
emojiRouter.post('/add', addEmojiController);
emojiRouter.get('/', getEmojiController);


module.exports = emojiRouter;