const User = require('../module/userModule');
const { default: axios } = require('axios');
const { config } = require('../utils/getConfig');
const { Client_ID, Client_Secret } = config.github;

// 成功页面模板
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
      const bc = new BroadcastChannel('AlienZHOU');
      const opener = window.opener;
      if (!opener) {
        console.error("找不到 opener");
        return;
      }
      bc.postMessage({
        type: "GITHUB_LOGIN_SUCCESS",
        payload: {
          token: ${JSON.stringify(token)},
          user: ${JSON.stringify(userInfo)}
        }
      }, "https://api.vocucd.cn");

      opener.postMessage({
        type: "GITHUB_LOGIN_SUCCESS",
        payload: {
          token: ${JSON.stringify(token)},
          user: ${JSON.stringify(userInfo)}
        }
      }, "https://api.vocucd.cn");

      setTimeout(() => {
        try {
          // window.close();
        } catch (e) {
          console.warn("无法关闭弹窗", e);
        }
      }, 500);
    })();
  </script>
</body>
</html>
`;
// 打开 GitHub 登录授权页
const githubAuthorizeLoginController = (req, res) => {
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${Client_ID}`;
  res.redirect(redirectUrl);
};

// GitHub 授权回调处理（同源）
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
          Accept: 'application/json'
        }
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      return res.status(500).json({ error: 'Token 获取失败' });
    }

    // 获取 GitHub 用户信息
    const userInfoResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json'
      }
    });

    const githubUserInfo = userInfoResponse.data;

    // 查找或创建用户
    let user = await User.findOne({ where: { githubId: githubUserInfo.id } });

    if (!user) {
      user = new User({
        githubId: githubUserInfo.id,
        ip: req.user?.ip || 'un',
        system: req.user?.system || 'un',
        name: githubUserInfo.login,
        imgurl: githubUserInfo.avatar_url,
        email: githubUserInfo.email || '未提供',
        token: access_token
      });

      await user.save();
    } else {
      user.name = githubUserInfo.login;
      user.imgurl = githubUserInfo.avatar_url;
      user.token = access_token;
      await user.save();
    }

    // 返回 HTML 页面用于通信
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.send(successPage(access_token, githubUserInfo));

  } catch (error) {
    console.error('GitHub OAuth 错误:', error.message);
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