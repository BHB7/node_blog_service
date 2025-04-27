const Article = require('../module/articleModule');
const Tag = require('../module/tagModule');
require('../module/relation');
/**
 * 获取指定 id 的文章，并自增浏览量。
 * 改进：先自增浏览量，然后返回完整文章数据
 */
const mysql = require('../db/mysql'); // 引入sequelize

const getArticleServiceById = async (articleId) => {
    const t = await mysql.transaction();  // 开启事务

    try {
        // 浏览量自增
        await Article.increment('view', { by: 1, where: { id: articleId }, transaction: t });

        // 查询文章
        const article = await Article.findByPk(articleId, { transaction: t });
        await t.commit(); // 提交事务
        
        return article;
    } catch (error) {
        await t.rollback(); // 如果有错误，回滚事务
        throw error;
    }
};


/**
 * 创建文章
 * 可选参数中 state 默认值设置为 '010'（如草稿或待发布状态），subset_id 和 label_id 默认值设为 0，
 * 并设定初始浏览量为 0.
 */
async function createArticleService({
    title,
    content,
    desc,
    cover,
    state = '010',
    user_id,
    subset_id = 0,
    tagIds = []
}) {


    if(desc.length > 100) throw new Error("字数过多");
    
    const article = await Article.create({
        title,
        content,
        desc,
        cover,
        state,
        user_id,
        subset_id,
        view: 0
    });

    // 优化：批量插入标签并且避免重复标签
    if (Array.isArray(tagIds) && tagIds.length > 0) {
        const tags = await Tag.findAll({ where: { id: tagIds } });
        await article.setTags(tags);
    }

    return article;
}

/**
 * 删除指定 id 的文章
 * 如果删除成功返回 true，否则返回 false
 */
async function deleteArticleService(id) {
    const result = await Article.destroy({ where: { id } });
    return result > 0;
}

/**
 * 分页查询文章列表
 * 改进：
 * - 使用 findAndCountAll 方法返回符合条件的文章总数以及当前分页的数据
 * - 保证传入参数为对象类型（避免 getArticlePageService(10, 0) 的参数错误）
 */
async function getArticlePageService({ pageSize = 10, pageOffset = 0 } = {}) {
    const { count, rows } = await Article.findAndCountAll({
        limit: pageSize,
        offset: pageOffset,
        order: [['updatedAt', 'desc']],
        include: [
            {
                model: Tag,
                as: 'tags',
                attributes: ['id', 'name', 'desc'],
                required: false
            }
        ],
        // 可以增加缓存等处理机制
    });

    return {
        total: count,
        list: rows.map(item => item.toJSON())
    };
}

/**
 * 修改文章
 * updateData 包含需要更新的字段
 * 返回 true 表示更新成功，false 表示更新失败
 */
async function updateArticleService(id, updateData) {
    // 打印更新的数据（调试可选）
    console.log(updateData);

    const [rowsUpdated] = await Article.update(updateData, {
        where: { id }
    });
    return rowsUpdated > 0;
}
module.exports = {
    getArticleServiceById,
    createArticleService,
    deleteArticleService,
    updateArticleService,
    getArticlePageService
};
