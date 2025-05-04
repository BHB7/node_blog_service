const User = require('../module/userModule');
const jwt = require("jsonwebtoken");
const { key } = require('../utils/getConfig');
const { setVerifyCode, getVerifyCode } = require('../utils/verifyCode');
const bcrypt = require('bcryptjs');
// 创建用户
async function createUserService(name, password) {
    try {
        const user = await User.create({ name, password, imgurl:'https://vocucd.cn/web/%E9%BB%98%E8%AE%A4%E5%A4%B4%E5%83%8F.png' });
        const {password:_, ...safeUser} = user.dataValues;
        return safeUser;
    } catch (err) {
        throw new Error(`创建用户失败：${err.message}`);
    };
};

// 通过uid获取用户
async function getUserService(id) {
    try {
        let whereClause = {};
        if (id) {
            whereClause = { id }; // 只有当id不为空或未定义时，才添加到查询条件中
        }

        const user = await User.findOne({ where: whereClause });
        const {password:_, ...safeUser} = user.dataValues;
        return safeUser;
    } catch (err) {
        throw new Error(`查询失败：${err.message}`);
    };
};

// 登录逻辑
async function loginService({ name, password }) {
    try {
        // 验证输入参数
        if (typeof name !== 'string' || name.trim() === '') {
            throw new Error("用户名不能为空或无效");
        }
        if (typeof password !== 'string' || password.trim() === '') {
            throw new Error("密码不能为空或无效");
        }

        // 查找用户
        const user = await User.findOne({
            where: { name }, // 确保字段名正确
            attributes: ['id', 'name', 'password']
        });
        // 检查查询结果
        if (!user || !user.id) {
            throw new Error("用户名或密码错误！");
        }
        // 验证密码是否正确
        const isPasswordValid = await bcrypt.compare(String(password), user.password);
        if (!isPasswordValid) throw new Error("用户名或密码错误！");

        // 生成 JWT Token
        const tokenStr = jwt.sign(
            { id: user.id, username: name },
            key,
            { expiresIn: '1h' }
        );

        // 返回用户信息（排除密码字段）
        const { password: _, ...safeUser } = user.dataValues;
        return { token: tokenStr, user: safeUser };

    } catch (err) {
        throw new Error(`登录失败：${err.message}`);
    }
}

// 注册服务
async function signupService(req) {
    try {
        // 验证输入
        const { name, password, email, code } = req;

        // 检查用户名是否已存在
        const oldUser = await User.findOne({ where: { name } });
        if (oldUser) {
            throw new Error("用户名已存在，请勿重复操作");
        }

        // 验证验证码
        const hostCode = await getVerifyCode(email);
        if (code !== hostCode) {
            throw new Error("注册失败：验证码错误");
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(String(password), 10);

        // 创建新用户
        const newUser = await User.create({
            name,
            password: hashedPassword, // 存储加密后的密码
            email,
            ip: req.user.ip,
            system: req.user.system
        });

        // 返回用户信息（排除密码字段）
        const { password: _, ...userWithoutPassword } = newUser.toJSON();
        return userWithoutPassword;

    } catch (err) {
        console.error("注册服务出错:", err.message);
        throw err; // 将错误传递给调用方
    }
}
// 更新用户信息
async function updateUserInfoService(uid, newInfo) {
    try {
        // 确保不更新密码字段
        const { password, ...safeNewInfo } = newInfo;

        // 执行更新操作
        const [rowsUpdated] = await User.update(safeNewInfo, {
            where: { id: uid }
        });

        if (rowsUpdated === 0) {
            throw new Error('未找到对应的用户进行更新');
        }

        return true; // 更新成功
    } catch (error) {
        console.error('更新用户信息失败:', error.message);
        throw error; // 将错误抛出，由调用方处理
    }
}
module.exports = {
    getUserService,
    createUserService,
    loginService,
    signupService,
    updateUserInfoService
}
