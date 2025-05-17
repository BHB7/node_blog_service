const { getUserService } = require('../service/userService');

/**
 * 通用权限中间件：检查用户是否是资源拥有者 或 具备管理员权限
 * @param {Model} resourceModel Sequelize 模型（如 Article, Tag）
 * @param {string} ownerIdField 数据归属字段（默认 'userId'）
 */
function checkOwnershipOrAdmin(resourceModel, ownerIdField = 'userId') {
    return async (req, res, next) => {
        const uid = req.auth?.id || req.user?.id;
        const resourceId = req.params.id;

        try {
            // 1. 获取当前用户信息
            const currentUser = await getUserService(uid);
            if (!currentUser) {
                return res.error('未授权', 401);
            }

            // 2. 获取资源对象
            const resource = await resourceModel.findByPk(resourceId);
            if (!resource) {
                return res.error('资源不存在', 404);
            }

            // 3. 判断是否为本人发布 or 管理员/超管
            const isOwner = resource[ownerIdField] === currentUser.id;
            const isAdmin = ['200', '020'].includes(currentUser.permissionLevel);

            if (!isOwner && !isAdmin) {
                return res.error('无权操作此内容', 403);
            }

            // 附加资源到 req 上，方便后续使用
            req.resource = resource;
            next();
        } catch (error) {
            console.error('权限检查失败:', error.message);
            return res.error('服务器异常');
        }
    };
}

module.exports = checkOwnershipOrAdmin;