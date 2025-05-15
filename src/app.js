const express = require("express");
const resFormat = require('./middleware/routerValue');
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressjwt } = require("express-jwt");
const { key } = require("./utils/getConfig");
const rateLimit = require('express-rate-limit');
const path = require('node:path');
const UAParser = require('ua-parser-js');

const userRouter = require('./routers/userRouter');
const articleRouter = require('./routers/articleRouter');
const uploadRouter = require('./routers/uploadRouter');
const tagRouter = require("./routers/tagRouter");
const adminHomeRouter = require("./routers/adminHomeRouter");
const normalizeIp = require("./utils/normalizeIp");
const githubAuthorizeRouter = require("./routers/githubAuthorizeRouter");
const cacheRouter = require("./routers/cacheRouter");
const { musicRouter } = require("./routers/musicRouter");


// 限流
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: '请求过于频繁，请稍后再试'
});

const app = express();


// 设置 EJS 作为模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'html'));  // 设置视图文件夹

// 中间件
app.use('/api/', limiter);
app.use(cors({ credentials: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(resFormat);
app.use((req, res, next) => {
    try {
        // 初始化 req.user 对象
        req.user = req.user || {};

        // 获取客户端 IP 地址
        const ip =
            req.headers['x-forwarded-for']?.split(',')[0] || // 反向代理中的真实 IP
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection && req.connection.socket ? req.connection.socket.remoteAddress : null);

        // 规范化 IP 地址（将 IPv6 转换为 IPv4）
        req.user.ip = normalizeIp(ip);

        // 解析 User-Agent
        const parser = new UAParser(req.headers['user-agent']);
        const result = parser.getResult();

        // 将解析结果附加到请求对象中
        req.user.system = result.os.name + result.os.version || 'Unknown OS';
        req.user.browser = result.browser.name || 'Unknown Browser';

        next();
    } catch (error) {
        console.error('中间件出错:', error.message);
        next(error); // 将错误传递给错误处理中间件
    }
});


// JWT 鉴权中间件
app.use('/api',
    expressjwt({ secret: key, algorithms: ["HS256"] }).unless({
        path: [
            /^\/api\/user\/(login|signup|sendCode)$/, // 匹配 /api/user/login 和 /api/user/register
            { url: /^\/api\/article\//, methods: ['GET'] },
            { url: /^\/api\/tag\//, methods: ['GET'] },
            { url: /^\/api\/article\/del/},
            { url: /^\/api\/github\//, methods: ['GET'] },
            { url: /^\/api\/cache\//, methods: ['GET'] },
            { url: /^\/api\/user\//, methods: ['GET'] },
        ],
    })
);

// 挂载路由
app.use('/api/user', userRouter);
app.use('/api/article', articleRouter);
app.use('/api/file', uploadRouter);
app.use('/api/tag', tagRouter);
app.use('/api/admin', adminHomeRouter);
app.use('/api/github', githubAuthorizeRouter);
app.use('/api/cache', cacheRouter);
app.use('/api/music', musicRouter);

// 测试接口
app.get('/', (req, res) => {
    res.send('hello world');
});

// 错误处理
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (err.name === "UnauthorizedError") {
        return res.error('啊哦，这个 Token 好像掉进了魔法迷雾里，无法识别！', 401)
    }
    return res.error(err.message);
});
// 自定义中间件：将用户信息挂载到 req.auth
app.use((req, res, next) => {
    if (req.user) {
        req.auth = req.user; // 将用户信息挂载到 req.auth
    }
    next();
});
module.exports = app;
