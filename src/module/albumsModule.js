const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql');

// 相册模型
const Albums  = mysql.define('albums ', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull:false,
        comment: '相册标题'
    },
    desc: {
        type: DataTypes.STRING,
        comment: '相册描述'
    }
});


module.exports = Albums;