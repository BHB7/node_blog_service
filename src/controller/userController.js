const { getUserService, loginService, signupService, updateUserInfoService } = require('../service/userService');
const { setVerifyCode, getVerifyCode, deleteVerifyCode } = require('../utils/verifyCode');

const sendMail = require('../utils/sendMail');
const genCode = require('../utils/getCode');
const { getErrEmoji, getSuccessEmoji } = require('../utils/getResEemoji');
const ejs = require('ejs');
const path = require('node:path');
const { default: axios } = require('axios');
function isNonEmptyString(val) {
    return typeof val === 'string' && val.trim() !== '';
}


// 发送生成验证码
const sendCodeController = async (req, res) => {
    const email = req.body?.email || req.query?.email;
    if (await getVerifyCode(email)) {
        return res.error('呜呜，验证码已经飞到你的邮箱啦~ 等一下，它会乖乖回来的！');
    }

    if (!email) return res.error('哎呀呀，邮箱空空如也哦，快填上一个小小邮箱吧！');

    // ✅ 
    const code = genCode(); // 生成验证码
    setVerifyCode(email, code); // 存入 Redis，有效期 5 分钟

    try {
        const html = await ejs.renderFile(path.join(__dirname, '../', 'html', 'email.ejs'), { code });
        await sendMail({
            to: email,
            subject: '验证码验证',
            html
        });
        return res.success('验证码已发送');
    } catch (err) {
        return res.error(err.message);
    }

};
// 通过uid获取用户信息
const getUserByIdController = async (req, res) => {
    const uid = req.params.uid || req.auth?.id || req.user?.id;
    try {
        const result = await getUserService(uid);
        res.success(result);
    } catch (err) {
        res.error('获取用户失败');
    }
};

// 获取超级管理员信息
const getAdminController = async (req, res) => {
    try {
        const result = await getUserService();
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
    if (!name || !password) return res.error('小参数不合法呢，可能是太害羞了~');

    try {
        const info = await loginService({ name, password });
        console.log(info);
        
        await updateUserInfoService(info.user.id, { ip: req.user.ip, system: req.user.system });
        res.success(info, '耶！登录成功啦，欢迎回来，我们等你很久了！');
    } catch (err) {
        res.error(err.message);
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
        return res.error('参数不合法');
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



        // 调用注册服务
        const data = await signupService({name, password, email, code, ...req});
        res.success(data);
        // 注册成功 删除code
        deleteVerifyCode(email);
    } catch (err) {
        res.error(err.message);
    }
};
// ip 地址获取
const getIpAddressController = async (req, res) => {
    try {      
        const {ip} = req.query
        const ipInfo = await axios.get(`https://api.mir6.com/api/ip?ip=${ip}&type=json`)
        console.log(ipInfo);
        res.success(ipInfo.data.data);
    } catch (error) {
        res.error('获取ip信息失败');
    }
}

// 更用户信息 
const updateUserInfoController = async (req, res) => {
    const { uid = req.params.uid || req.auth?.id || req.user?.id, ...args } = req.body;
    if(!uid) return res.error('参数不合法'); 
    try {      
        const flag = await updateUserInfoService(uid, args);
        if(!flag) return res.error('更新失败');
        res.success(null, '更新成功');
    } catch (error) {
        res.error('更新信息失败');
    }
}
module.exports = {
    getUserByIdController,
    loginController,
    signupController,
    sendCodeController,
    getIpAddressController,
    getAdminController,
    updateUserInfoController
};
