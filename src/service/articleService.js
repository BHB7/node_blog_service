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
        const article = await Article.findByPk(articleId,
            {
                transaction: t,
                include: [
                    {
                        model: Tag,
                        as: 'tags',
                        attributes: ['id', 'name', 'desc'],
                        required: false
                    }
                ],
            }
        );
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
async function createArticleService({ title, content, desc, cover, tagIds, user_id, ip, system, state }) {
    if (desc.length > 100) throw new Error("文章描述字数超过限制");

    const article = await Article.create({ title, content, desc, cover, tagIds, user_id, ip, system, state});

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
async function delArticleService(id) {
    const result = await Article.destroy({ where: { id } });
    console.log(result,555);
    
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
    try {
        const { tagIds } = updateData;

        // 打印更新的数据（调试可选）
        console.log('更新数据:', updateData);

        // 更新文章的基本信息
        const [rowsUpdated] = await Article.update(updateData, {
            where: { id }
        });

        if (rowsUpdated === 0) {
            throw new Error('未找到对应的文章进行更新');
        }

        // 查询文章实例
        const article = await Article.findByPk(id);
        if (!article) {
            throw new Error('未找到对应的文章实例');
        }

        // 如果提供了标签 ID 列表，则更新文章的标签关联
        if (Array.isArray(tagIds) && tagIds.length > 0) {
            // 检查标签是否存在
            const tags = await Tag.findAll({ where: { id: tagIds } });
            if (tags.length !== tagIds.length) {
                throw new Error('部分标签不存在');
            }
            // 更新文章与标签的关联关系
            await article.setTags(tagIds);
        }

        return true; // 更新成功
    } catch (error) {
        console.error('更新文章失败:', error.message);
        throw error; // 将错误抛出，由调用方处理
    }
}
module.exports = {
    getArticleServiceById,
    createArticleService,
    delArticleService,
    updateArticleService,
    getArticlePageService
};
