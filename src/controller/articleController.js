const { getArticleService, createArticleService, deleteArticleService, updateArticleService } = require('../service/articleService');

// 添加文章接口
const createArticleController = async (req, res) => {
    if (!req.body) {
        return res.error('请求体为空，请确认请求格式是否为 JSON');
    }

    const { title, content, desc, cover, user_id } = req.body;

    // 需要验证的字段
    const requiredFields = { title, content, desc, cover, user_id };

    // 遍历验证字段
    for (const [key, value] of Object.entries(requiredFields)) {
        if (value === undefined || value === null || value === '') {
            return res.error(`${key} 不能为空`);
        }
    }

    try {
        // 调用创建文章服务
        const article = await createArticleService(req.body);
        res.success(article);
    } catch (err) {
        // 错误日志打印，方便调试
        console.error('创建文章失败:', err);
        res.error('添加失败', err.message);
    }
};

// 更新文章
const updateArticleController = async (req, res) => {
    if (!req.body) {
        return res.error('请求体为空，请确认请求格式是否为 JSON');
    }

    const { aid, title, content, desc, cover, user_id, state, label_id, subset_id } = req.body;

    // 校验文章 ID 和必填字段
    if (!aid) {
        return res.error('文章ID (aid) 不能为空');
    }

    try {
        // 调用更新文章服务
        const isOk = await updateArticleService(aid, { title, content, desc, cover, user_id, state, label_id, subset_id });
        if (isOk) {
            res.success('更新成功');
        } else {
            res.error('更新失败，找不到文章');
        }
    } catch (err) {
        console.error('更新文章失败:', err);
        res.error('更新失败', err.message);
    }
};

module.exports = {
    createArticleController,
    updateArticleController
};
