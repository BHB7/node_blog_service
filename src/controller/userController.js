const { getAllService, loginService, signupService } = require('../service/userService');
const { setVerifyCode, getVerifyCode, deleteVerifyCode } = require('../utils/verifyCode');
const sendMail = require('../utils/sendMail');
const genCode = require('../utils/getCode');
function isNonEmptyString(val) {
    return typeof val === 'string' && val.trim() !== '';
}


// 发送生成验证码
const sendCodeController = async (req, res) => {
    const email = req.body?.email || req.query?.email;
    if (await getVerifyCode(email)) {
        return res.error('验证码已发送，请勿重复请求');
    }
    
    if (!email) return res.error('邮箱不能为空');

    // ✅ 
    const code = genCode(); // 生成验证码
    setVerifyCode(email, code); // 存入 Redis，有效期 5 分钟

    try {
        await sendMail({
            to: email,
            subject: '验证码验证',
            html: `<h2>您的验证码是：<b>${code}</b>，5分钟内有效</h2>`
        });
        return res.success('验证码已发送');
    } catch (err) {
        return res.error('验证码发送失败', err.message);
    }

};
const getUserAll = async (req, res) => {
    try {
        const result = await getAllService();
        res.success(result);
    } catch (err) {
        res.error('获取用户失败');
    }
};

/**
 * 登录控制
 */
const loginController = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) return res.error('参数不合法');

    try {
        const info = await loginService({ name, password });
        res.success(info);
    } catch (err) {
        res.error(`登录失败：${err.message}`);
    }
};

/**
 * 注册控制
 */
const signupController = async (req, res) => {
    const { name, password, email, code } = req.body;
    
    if (!
        isNonEmptyString(name) &&
        isNonEmptyString(password) &&
        isNonEmptyString(email) &&
        isNonEmptyString(code)
    ) {
        return res.error('参数不合法ssss');
    }
    

    try {
        // 1. 校验验证码
        const savedCode = await getVerifyCode(email);
        if (!savedCode) {
            return res.error('验证码已过期或未发送');
        }
        if (savedCode !== code) {
            return res.error('验证码错误');
        }

        // 2. 删除验证码，防止重复使用（可选）
        await deleteVerifyCode(email);

        // 3. 调用注册服务
        const data = await signupService({ name, password, email });
        res.success(data);
    } catch (err) {
        res.error(`注册失败：${err.message}`);
    }
};
module.exports = {
    getUserAll,
    loginController,
    signupController,
    sendCodeController
};
