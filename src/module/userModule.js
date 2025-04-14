const mysql = require('../db/mysql');
const { DataTypes } = require('sequelize');

const User = mysql.define('user', {
    name: {
        type:DataTypes.STRING,
        // 不允许为null
        allowNull: false, 
    },
    password:DataTypes.STRING,
    age: DataTypes.INTEGER,
    mail: DataTypes.STRING,
    imgurl: DataTypes.STRING
    
});


( async () => {
   await User.sync()
})();


module.exports = User