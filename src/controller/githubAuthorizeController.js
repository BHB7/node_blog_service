const User = require('../module/userModule');
const { default: axios } = require('axios');
const { config } = require('../utils/getConfig');
const { Client_ID, Client_Secret } = config.github;

const githubAuthorizeLoginController = (req, res) => {
    let redirectUrl = 'https://github.com/login/oauth/authorize?client_id='.concat(Client_ID);
    // 重定向到github登录
    res.redirect(redirectUrl);
};

// GitHub 授权回调处理
const githubAuthorizeCallbackController = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ error: 'Missing authorization code' });
        }

        // 获取 access_token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: Client_ID,
                client_secret: Client_Secret,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
                httpsAgent: new (require('https')).Agent({
                    rejectUnauthorized: false, // 忽略证书验证（仅限开发环境）
                }),
            }
        );

        const { access_token } = tokenResponse.data;

        if (!access_token) {
            return res.error('Token已经失效了哦', 500);
        }

        // 使用 access_token 获取用户信息
        const userInfoResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json',
            },
            httpsAgent: new (require('https')).Agent({
                rejectUnauthorized: false, // 忽略证书验证（仅限开发环境）
            }),
        });

        const githubUserInfo = userInfoResponse.data;

        // 检查用户是否已存在
        let user = await User.findOne({ where: { githubId: githubUserInfo.id } });

        if (!user) {
            // 创建新用户
            user = new User({
                githubId: githubUserInfo.id,
                name: githubUserInfo.login,
                imgUrl: githubUserInfo.avatar_url,
                email: githubUserInfo.email || '未提供',
                token: access_token, // 存储访问令牌以便后续API调用
            });

            await user.save();
        } else {
            // 更新用户信息
            user.name = githubUserInfo.login;
            user.imgUrl = githubUserInfo.avatar_url;
            user.token = access_token; // 更新访问令牌
            await user.save();
        }
        res.redirect('https://vocucc.cn');

    } catch (error) {
        console.error('Error during GitHub OAuth process:', error);

        if (error.response) {
            // 服务器返回了错误响应
            return res.error('验证失败了',error.response.status || 500);
        }

        // 其他错误
        return res.error('服务器异常',500);
    }
};

module.exports = {
    githubAuthorizeLoginController,
    githubAuthorizeCallbackController,
};