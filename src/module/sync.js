const mysql = require('../db/mysql');
const { config } = require('../utils/getConfig');
(async () => {
    await mysql.sync({ force:config.sqlDeepSync });
    console.log('所有模型同步完成');
    
})();