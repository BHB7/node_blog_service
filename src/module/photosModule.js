const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql');

// 图片模型
const Photos = mysql.define('photos', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    aid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'albums_id' // ← 显式映射到数据库字段名
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '图片标题'
    },
    desc: {
        type: DataTypes.STRING,
        comment: '图片描述'
    },
    url: {
        type: DataTypes.STRING,
        comment: '图片链接'
    }
});


module.exports = Photos;
