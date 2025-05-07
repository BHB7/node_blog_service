const mysql = require('../db/mysql');

(async () => {
    await mysql.sync();
    console.log('所有模型同步完成');
    
})();