const { getArticleServiceById,
     createArticleService, 
     deleteArticleService,
     updateArticleService,
     getArticlePageService
    } = require('../service/articleService');

// 添加文章接口
const createArticleController = async (req, res) => {
    if (!req.body) {
        return res.error('请求体为空，请确认请求格式是否为 JSON');
    }

    const { title, content, desc, cover } = req.body;
    // 从jwt中拿到用户id
    const user_id = req.user.id; 
    // 需要验证的字段
    const requiredFields = { title, content, desc, cover, user_id };

    // 遍历验证字段
    for (const [key, value] of Object.entries(requiredFields)) {
        if (value === undefined || value === null || value === '') {
            return res.error(`${key}: 小参数不合法呢，可能是太害羞了~`);
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


// 获取文章分页的控制器
const getArticlePageController = async (req, res) => {
    try {
        // 合并 req.body 和 req.query，确保参数来源统一
        const reqData = { ...req.query, ...req.body };

        // 提取分页参数并转换为数字，并设置默认值
        let { pageSize = 10, pageOffset = 0 } = reqData;
        pageSize = Number(pageSize) || 10;
        pageOffset = Number(pageOffset) || 0;

        // 调用服务层查询文章，并返回 total 与 list 对象（假设服务返回结构已优化）
        const pageList = await getArticlePageService({ pageSize, pageOffset });
        
        // 成功响应
        res.success(pageList);
    } catch (error) {
        console.error('获取文章分页失败:', error);
        res.error('获取文章分页失败');
    }
};

module.exports = {
    createArticleController,
    updateArticleController,
    getArticlePageController
};
