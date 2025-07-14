const User = require("../module/userModule");
const { default: axios } = require("axios");
const { config } = require("../utils/getConfig");
const { Client_ID, Client_Secret } = config.gitee;
const jwt = require("jsonwebtoken");
const { key } = require("../utils/getConfig");

const redirect_uri =  "http://localhost:8000/gitee/login/callback";

const giteeAuthorizeLoginController = (req, res) => {
  const authUrl = `https://gitee.com/oauth/authorize?client_id=${encodeURIComponent(Client_ID)}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=user_info%20email`;
  res.redirect(authUrl);
};
//回调处理（同源）
const giteeAuthorizeCallbackController = async (req, res) => {
  // gitee登录
  // 1、校验必填参数
  if (!req.body.code) {
    throw new Error("必填参数不能为空！");
  }
  // 2、获取 Access token
  const accessTokenInfo = await getAccessToken(req.body.code);
  // 3、获取用户信息
  const userInfo = await getUserInfo(accessTokenInfo.access_token);
  // 4、在这步你可以将用户信息存入数据库中等其他操作，这里我直接返回了
  // 查找或创建用户
  let user = await User.findOne({ where: { githubId: userInfo.id } });

  if (!user) {
    user = new User({
      githubId: userInfo.id,
      ip: req.user?.ip || "un",
      system: req.user?.system || "un",
      name: userInfo.login,
      avatar: userInfo.avatar_url,
      email: userInfo.email || "未提供",
      token: accessTokenInfo.access_token,
      motto: userInfo.bio,
    });

    await user.save();
  } else {
    user.name = userInfo.login;
    user.avatar = userInfo.avatar_url;
    user.token = accessTokenInfo.access_token;
    await user.save();
  }

  // 生成JWT
  // 生成 JWT Token
  const tokenStr = jwt.sign({ id: user.id, username: user.name }, key, {
    expiresIn: "1h",
  });
  res.success(userInfo);
};

// 获取 access_token
async function getAccessToken(code) {
  // 官方文档： https://gitee.com/api/v5/oauth_doc#/list-item-2
  // 向gitee发送post请求，成功的话会，response.data里面有一个access_token
  try {
    const response = await axios({
      method: "post",
      url: "https://gitee.com/oauth/token",
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: giteeConfig.redirect_uri,
        client_id: giteeConfig.client_id,
        client_secret: giteeConfig.client_secret,
      },
    });

    if (!response.data?.access_token) {
      throw new Error("获取 access_token 失败！");
    }

    // response.data:{
    //   access_token: '3875ff7f7def72c6e05285895e4eb3f2',
    //   token_type: 'bearer',
    //   expires_in: 86400,
    //   refresh_token: '138ea028c08769fd798249bc297b095fa41ee4fdd9d5e55bbcef1a1b36db3338',
    //   scope: 'user_info projects pull_requests issues notes keys hook groups gists enterprises emails',
    //   created_at: 1725805674
    // }

    return response.data;
  } catch (error) {
    throw new Error(error.response.data?.error_description);
  }
}

// 获取用户信息
async function getUserInfo(access_token) {
  //官方文档： https://gitee.com/api/v5/swagger#/getV5User
  const response = await axios({
    method: "get",
    url: "https://gitee.com/api/v5/user",
    params: {
      access_token,
    },
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${access_token}`,
    },
  });

  console.log("response", response.data);

  if (!response.data?.id) throw new Error("获取用户信息失败！");

  /**
  response.data = {
    "id": 9534923,
    "login": "china-quanda",
    "name": "China-Quanda",
    "avatar_url": "https://foruda.gitee.com/avatar/1677178346321314348/9534923_china-quanda_1627964208.png",
    "url": "https://gitee.com/api/v5/users/china-quanda",
    "html_url": "https://gitee.com/china-quanda",
    "remark": "",
    "followers_url": "https://gitee.com/api/v5/users/china-quanda/followers",
    "following_url": "https://gitee.com/api/v5/users/china-quanda/following_url{/other_user}",
    "gists_url": "https://gitee.com/api/v5/users/china-quanda/gists{/gist_id}",
    "starred_url": "https://gitee.com/api/v5/users/china-quanda/starred{/owner}{/repo}",
    "subscriptions_url": "https://gitee.com/api/v5/users/china-quanda/subscriptions",
    "organizations_url": "https://gitee.com/api/v5/users/china-quanda/orgs",
    "repos_url": "https://gitee.com/api/v5/users/china-quanda/repos",
    "events_url": "https://gitee.com/api/v5/users/china-quanda/events{/privacy}",
    "received_events_url": "https://gitee.com/api/v5/users/china-quanda/received_events",
    "type": "User",
    "blog": null,
    "weibo": null,
    "bio": "时间过得很快，不记录很难回忆起来",
    "public_repos": 11,
    "public_gists": 0,
    "followers": 4,
    "following": 10,
    "stared": 241,
    "watched": 29,
    "created_at": "2021-08-03T12:11:18+08:00",
    "updated_at": "2024-09-08T14:52:57+08:00",
    "email": "864910436@qq.com"
  }
  */

  return response.data;
}

module.exports = {
  giteeAuthorizeLoginController,
  giteeAuthorizeCallbackController,
};
