const mysql = require('../db/mysql');

(async () => {
    await mysql.sync({force:true})
    console.log('所有模型同步完成');
    
})();