const User = require('../module/userModule');
const { default: axios } = require('axios');
const { config } = require('../utils/getConfig');
const { Client_ID, Client_Secret } = config.github;



const successPage = (token, userInfo) => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>GitHub 登录成功</title>
</head>
<body>
  <h3>登录成功！正在跳转...</h3>

  <script>
    (function() {
      const opener = window.opener;
      if (!opener) {
        console.error("找不到 opener");
        return;
      }

      opener.postMessage({
        type: "GITHUB_LOGIN_SUCCESS",
        payload: {
          token: ${JSON.stringify(token)},
          user: ${JSON.stringify(userInfo)}
        }
      }, "https://vocucc.cn");

      setTimeout(() => {
        try {
          window.close();
        } catch (e) {
          console.warn("无法关闭弹窗", e);
        }
      }, 500);
    })();
  </script>
</body>
</html>
`;


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
            return res.status(400).json({ error: '缺少授权码' });
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
                    rejectUnauthorized: false,
                }),
            }
        );

        const { access_token } = tokenResponse.data;

        if (!access_token) {
            return res.error('Token 已失效', 500);
        }

        // 获取 GitHub 用户信息
        const userInfoResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`,
                Accept: 'application/json',
            },
            httpsAgent: new (require('https')).Agent({
                rejectUnauthorized: false,
            }),
        });

        const githubUserInfo = userInfoResponse.data;

        // 检查用户是否存在，不存在则创建
        let user = await User.findOne({ where: { githubId: githubUserInfo.id } });

        if (!user) {
            user = new User({
                githubId: githubUserInfo.id,
                ip: req.user.ip || 'un',
                system: req.user.system || 'un',
                name: githubUserInfo.login,
                imgurl: githubUserInfo.avatar_url,
                email: githubUserInfo.email || '未提供',
                token: access_token,
            });

            await user.save();
        } else {
            user.name = githubUserInfo.login;
            user.imgurl = githubUserInfo.avatar_url;
            user.token = access_token;
            await user.save();
        }

        // 返回 HTML 页面用于弹窗通信
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        res.send(successPage(access_token, githubUserInfo));

    } catch (error) {
        console.error('GitHub OAuth 错误:', error.message);

        // 返回错误页面或信息
        res.status(500).send(`
          <h3>登录失败，请稍后再试</h3>
          <script>
            setTimeout(() => window.close(), 1000);
          </script>
        `);
    }
};

module.exports = {
    githubAuthorizeLoginController,
    githubAuthorizeCallbackController,
};