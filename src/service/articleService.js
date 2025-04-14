const Article = require('../module/articleModule');

// 获取指定id文章 并浏览量自增
const getArticleService = async (articleId) => {
    return await Article.increment('view', {
        by: 1,
        where: { id: articleId }
    });
};

// 创建文章
async function createArticleService({
    title,
    content,
    desc,
    cover,
    state = '010',
    user_id,
    subset_id = 0,
    label_id = 0,
}) {
    return await Article.create({
        title,
        content,
        desc,
        cover,
        state,
        user_id,
        subset_id,
        label_id,
        view: 0 // 初始浏览量
    });
}

// 删除文章
async function deleteArticleService(id) {
    const result = await Article.destroy({ where: { id } });
    return result > 0; // 返回是否成功删除
}

// 修改文章
async function updateArticleService(id, updateData) {
    console.log(updateData);
    
    const [rowsUpdated] = await Article.update(updateData, {
        where: { id }
    });
    return rowsUpdated > 0;
}

module.exports = {
    getArticleService,
    createArticleService,
    deleteArticleService,
    updateArticleService
};
