const crypto = require('crypto');
const { setVerifyCode } = require('../utils/verifyCode');

const getUniqueIdController = async (req, res) => {
    try {
        const uuid = crypto.randomUUID({ disableEntropyCache: true });
        await setVerifyCode(uuid, uuid);
        res.success(uuid);
    } catch (error) {
        res.error('获取uuid失败');
    }
}

module.exports = {
    getUniqueIdController
}