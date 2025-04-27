const Tag = require('../module/tagModule');
const { Op } = require('sequelize'); // 引入 Sequelize 的 Op 操作符

// 获取tag
async function getTagService({ tid, name, desc }) {
    // 动态构造查询条件
    const conditions = {};
    if (tid) conditions.id = tid;
    if (name) conditions.name = { [Op.like]: `%${name}%` };
    if (desc) conditions.desc = { [Op.like]: `%${desc}%` };

    try {
        const tags = await Tag.findAll({
            where: conditions
        });
        return tags; // 返回查询结果
    } catch (error) {
        console.error('发生错误:', error);
        throw new Error('获取tag失败');
    };
};

// 创建tag
async function createTagService({ name, desc }) {
    try {
        if ((await getTagService({ name })).length > 0) return '标签已存在';
        const tag = await Tag.build({ name, desc}).save();
        return tag.toJSON();
    } catch (error) {
        throw new Error(error.message);
    };
};

// 删除tag true 删除成功 false 删除失败
async function deleteTagService({ tid }) {
    try {
      const result = await Tag.destroy({ where: { id: tid } });
      return result > 0;
      
    } catch (error) {
        console.log('tagdel错误：',error.message);
        
        throw new Error("删除tag失败");
        
    };
};
module.exports = {
    createTagService,
    deleteTagService,
    getTagService
};