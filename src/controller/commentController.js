const { addCommentService, delCommentService, getCommentsService } = require('../service/comentService');



const addCommentController = async (req, res) => {
     // 从 JWT 中获取用户 ID
    const user_id = req.auth?.id || req.user?.id; // 兼容 req.auth 和 req.user
    let { content, aid, uid, pid } = req.body;
    if(!uid) uid = user_id;
    try {
        const response = await addCommentService({ content, aid, uid, pid });
        res.success(response, '评论成功');
    } catch (error) {
        res.error(error.message);
    }
}



const delCommentController = async (req, res) => {
    const { cid } = req.params || req.query;
    // 从 JWT 中获取用户 ID
    const user_id = req.auth?.id || req.user?.id; // 兼容 req.auth 和 req.user
    try {
        const response = await delCommentService(cid, user_id);
        res.success(response, '删除评论成功');
    } catch (error) {
        res.error('删除评论失败');
    }
}

const getCommentsController = async (req, res) => {
    const { aid, cid, page, size, sort } = req.params || req.body;
    try {
        const response = await getCommentsService(aid,cid, { page, size, sort });
        res.success(response, '获取评论成功')
    } catch (error) {
        res.error('获取评论失败');
    }
}

module.exports = {
    addCommentController,
    delCommentController,
    getCommentsController
}