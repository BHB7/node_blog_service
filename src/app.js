const express = require("express");
const resFormat = require('./middleware/routerValue');
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressjwt } = require("express-jwt");
const { key } = require("./utils/getConfig");
const rateLimit = require('express-rate-limit');
const path = require('node:path');

const userRouter = require('./routers/userRouter');
const articleRouter = require('./routers/articleRouter');
const uploadRouter = require('./routers/uploadRouter');
const tagRouter = require("./routers/tagRouter");


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

// JWT 鉴权中间件
app.use('/api',
    expressjwt({ secret: key, algorithms: ["HS256"] }).unless({
        path: [
            /^\/api\/user\//,
            { url: /^\/api\/article\//, methods: ['GET'] },
        ],
    })
);

// 挂载路由
app.use('/api/user', userRouter);
app.use('/api/article', articleRouter);
app.use('/api/file', uploadRouter);
app.use('/api/tag', tagRouter);

// 测试接口
app.get('/', (req, res) => {
    res.send('hello world');
});

// 错误处理
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (err.name === "UnauthorizedError") {
        return res.error('啊哦，这个 Token 好像掉进了魔法迷雾里，无法识别！')
    }
    return res.error(err.message);
});

module.exports = app;
