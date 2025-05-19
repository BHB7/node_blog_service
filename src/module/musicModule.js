const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql');

// 我的音乐列表 存储 音乐id | 音乐名
const Music = mysql.define('music', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type:DataTypes.INTEGER,
        allowNull:false
    },
    song_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    song_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    url: [
        DataTypes.STRING
    ]
});

module.exports = Music;
