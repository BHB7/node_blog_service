const Redis = require('ioredis');
const redis = new Redis({
    host: 'localhost',
    port: 6379, // 默认端口，修改为你使用的端口
    // password: 'your-redis-password', // 如果 Redis 配置了密码，提供密码
});

redis.on('connect', () => {
    console.log('Redis client connected');
});

redis.on('error', (err) => {
    console.log('Redis client error:', err);
});
const EXPIRE_TIME = 60 * 5; // 5分钟有效

// 设置验证码
async function setVerifyCode(email, code) {
    const key = `verify_code:${email}`;
    await redis.set(key, code, 'EX', EXPIRE_TIME);
}

// 获取验证码
async function getVerifyCode(email) {
    const key = `verify_code:${email}`;
    return await redis.get(key);
}

// 删除验证码（可选）
async function deleteVerifyCode(email) {
    const key = `verify_code:${email}`;
    await redis.del(key);
}
// deleteVerifyCode('1812287263@qq.com')
module.exports = {
    setVerifyCode,
    getVerifyCode,
    deleteVerifyCode
};
