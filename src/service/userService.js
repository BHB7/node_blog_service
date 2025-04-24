const User = require('../module/userModule');
const jwt = require("jsonwebtoken");
const { key } = require('../utils/getConfig');
const { setVerifyCode, getVerifyCode } = require('../utils/verifyCode');
const { promises } = require('nodemailer/lib/xoauth2');
// 创建用户
async function createUserService(name, password) {
    try {
        const user = await User.create({ name, password });
        return user;
    } catch (err) {
        throw new Error(`创建用户失败：${err.message}`);
    }
}

// 获取所有用户
async function getAllService() {
    try {
        const users = await User.findAll();
        return users.map(u => u.dataValues);
    } catch (err) {
        throw new Error(`查询失败：${err.message}`);
    }
}

// 登录逻辑
async function loginService({ name, password }) {
    try {
        const user = await User.findOne({ where: { name, password } });
        if (!user) throw new Error("用户名或密码错误！");

        const tokenStr = jwt.sign({ username: name }, key, {
            expiresIn: '1h'
        });

        return { token: tokenStr, user: user.dataValues };
    } catch (err) {
        throw new Error(`登录失败：${err.message}`);
    }
}

// 注册
async function signupService({ name, password, mail = '', code}) {
    try {
       const hostCode = await getVerifyCode(mail)
       const oldUser = await User.findOne({where:{name}})
       console.log(oldUser)
       if(oldUser) throw new Error("用户名已存在 请勿重复操作");
       
       if(!+code === +hostCode) throw new Error("注册失败：验证码错误");
       const user = await User.build({ name, password, mail }).save();
       return user
    } catch (err) {
        throw new Error(`${err.message}`);
    }

}

module.exports = {
    getAllService,
    createUserService,
    loginService,
    signupService
};
