const { deleteVerifyCode } = require('../utils/verifyCode');
async function cache(req, res, next) {
    try {
        const uuid = req.headers.uuid;
        if (!uuid) return res.error('参数错误');
        await deleteVerifyCode(uuid);
        next();
    } catch (error) {
        return next(error);
    };
};

module.exports = cache;
