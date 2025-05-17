const { getUserService } = require('../service/userService');

async function auth(req, res, next) {
    const uid = req.params.uid || req.auth?.id || req.user?.id;

    try {
        const userInfo = await getUserService(uid);
        // 判断权限是否为超级管理员或管理员
        const allowedLevels = ['200', '020'];
        if (!allowedLevels.includes(userInfo.permissionLevel)) {
            return res.error('权限不足',403);
        }
        next();
    } catch (error) {
        return next(error);
    }
}

module.exports = auth;