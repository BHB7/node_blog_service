const { addEmojiService, delEmojiService, getEmojiService,  } = require('../service/emojiService');


const addEmojiController = async (req, res) => {
    const { url, desc } = req.body;
    if(!url && !desc) return res.error('非法参数');
    
    try {
      const response = await addEmojiService(desc, url);
      res.success(response);
    } catch (error) {
      res.error(error);
    };
};


const delEmojiController = async (req, res) => {
    const { eid } = req.query || req.params;
    try {
      const response = await delEmojiService(eid);
      res.success(response);
    } catch (error) {
      res.error(error);
    }
};

const getEmojiController = async (req, res) => {
    try {
      const response = await getEmojiService();
      console.log(response);
      
      res.success(response, '获取emoji成功');
    } catch (error) {
      res.error(error);
    }
};

module.exports = {
    addEmojiController,
    delEmojiController,
    getEmojiController
}