const express = require("express");
const resFormat = require('./middleware/routerValue');
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressjwt } = require("express-jwt");
const { key } = require("./utils/getConfig");
const userRouter = require('./routers/userRouter');
const articleRouter = require('./routers/articleRouter');
const app = express();

app.use(cors());
app.use(express.json());
// post 解析表单
app.use(bodyParser.urlencoded({ extended: false }));
app.use(resFormat);

// JWT解析中间件
app.use(
    expressjwt({ secret: key, algorithms: ["HS256"] }).unless({
        path: [
            /^\/user\//, // 用户接口
            { url: /^\/article$/, methods: ['GET'] }, // 排除获取全部文章的 GET 请求
          ],
    })
);

app.use('/user', userRouter);
app.use('/article', articleRouter)



app.get('/', (req, res) => {
    res.send('hello world');
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
    // 如果 token 解析失败，返回 401 错误
    if (err.name === "UnauthorizedError") {
        return res.send({
            status: 401,
            message: "无效的token",
        });
    }
    // 其他未知错误
    return res.error(err.message);
});

module.exports = app;
