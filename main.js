const app = require('./src/app')
const { port } = require('./src/utils/getConfig')
const cron = require('node-cron')
// 每天午夜 12 点执行一次
// cron.schedule('0 0 * * *', () => {
    
    
// });
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

