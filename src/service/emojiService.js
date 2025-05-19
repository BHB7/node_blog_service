const Emoji = require('../module/emojiModule');

async function addEmojiService(desc, url) {
  try {
    const emojiUrl = await Emoji.findOne({where:{url}});
    if(emojiUrl) throw new Error("emoji已存在");
    const emoji = await Emoji.create({ url, desc });
    console.log(emoji.dataValues);
    
  } catch (error) {
    console.error('插入失败:', error.message);
    throw new Error(`插入失败:`+error.message);
  }
};

async function delEmojiService(eid) {
  try {
    await Emoji.destroy({where: {id:eid}});
    return '删除emoji成功';
  } catch (error) {
    console.error('删除emoji失败:', error.message);
    throw new Error(`删除emoji失败${error.message}`);
  }
};

async function getEmojiService() {
  try {
    const emojiList = await Emoji.findAll();
    return emojiList;
  } catch (error) {
    console.log(`获取emoji失败:${error.message}`);
    
    throw new Error("获取emoji失败");
  }
}

module.exports = {
    addEmojiService,
    delEmojiService,
    getEmojiService
}