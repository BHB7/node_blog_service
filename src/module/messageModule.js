const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql');

// 留言模型
const Message  = mysql.define('message', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content:{
        type: DataTypes.STRING,
        allowNull:false,
        comment: '留言内容'
    }
});


module.exports = Message;