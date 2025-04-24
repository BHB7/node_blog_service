const { Sequelize } = require('sequelize');
const { dburi } = require('../utils/getConfig');

const mysql = new Sequelize(dburi, {
  dialect: 'mysql'
});

(async () => {
  try {
    await mysql.authenticate();
    console.log('数据库链接成功');
    console.log('同步数据');
    
    require('../module/init'); 
  } catch (error) {
    console.error('连接数据库失败:', error);
  }
})();


module.exports = mysql