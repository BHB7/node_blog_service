const Article = require('../module/articleModule');
const Tag = require('../module/tagModule');
const Comment = require('../module/commentModule');
const { getUserService } = require('../service/userService');

/**
 * 添加评论服务函数
 * @param {Object} params
 * @param {number} params.uid 用户ID
 * @param {number} params.aid 所属文章ID
 * @param {string} params.content 评论内容
 * @param {number|null} [params.pid=null] 回复的目标评论ID（可选）
 * @returns {Promise<Object>} 创建的评论对象
 */
async function addCommentService({ uid, aid, content, pid = null }) {
    try {
        // 1. 验证用户是否存在
        const user = await getUserService(uid);
        if (!user) {
            throw new Error('用户不存在');
        }

        // 2. 检查必要字段是否为空
        if (!uid || !aid || !content || typeof content !== 'string' || content.trim() === '') {
            throw new Error('用户ID、文章ID、评论内容不能为空');
        }

        // 3. 创建评论记录（无需 include）
        const comment = await Comment.create({
            uid,
            aid,  // ← 正确设置文章ID，Sequelize 会自动关联 Article
            pid,
            content: content.trim()
        });

        // 4. 可选：如果你希望返回评论 + 对应的文章信息，可以再查询一次
        const commentWithArticle = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: Article,
                as: 'article',   // 使用你在 belongsTo 中定义的别名
                attributes: ['id', 'title'] // 只获取需要的字段
            }]
        });

        // 5. 返回新创建的评论信息（可包含文章信息）
        const data = commentWithArticle.get({ plain: true });

        return {
            id: data.id,
            uid: data.uid,
            aid: data.aid,
            pid: data.pid,
            content: data.content,
            createdAt: data.createdAt,
            article: data.article // ← 包含文章信息（可选）
        };

    } catch (error) {
        console.error('添加评论失败:', error.message);
        throw new Error(`添加评论失败：${error.message}`);
    }
}
async function delCommentService(cid) {

    if (!cid) return
    try {
        const res = await Comment.destroy({ where: { id: cid } })
        console.log(res);
    } catch (error) {
        console.error('删除评论失败:', error.message);
        throw new Error(`删除评论失败：${error.message}`);
    }

}


module.exports = {
    addCommentService,
    delCommentService
}