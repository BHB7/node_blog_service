const { addCommentService, delCommentService } = require('../service/comentService');



const addCommentController = async (req, res) =>{
    const {content, aid, uid, pid } = req.body;
    try {
        const response = await addCommentService({ content, aid, uid, pid });
        res.success(response, '评论成功');
    } catch (error) {
        res.error(error.message);
    }
}


 
const delCommentController = async (req, res) =>{
    const { uid, aid, pid, content } = req.body;
    try {
        const response = await delCommentService(uid, aid, pid, content);
        res.success(response, '删除评论成功');
    } catch (error) {
        res.error('删除评论失败');
    }
}



module.exports = {
    addCommentController,
    delCommentController
}