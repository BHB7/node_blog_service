const mysql = require('../db/mysql');
const { DataTypes } = require('sequelize');
const Tag = mysql.define('tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '标签名 | 唯一'
    },
    desc: {
        type: DataTypes.STRING,
        comment: '标签描述'
    }
});

module.exports = Tag;