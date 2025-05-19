const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql')


const Comment = mysql.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uid: {
        type: DataTypes.INTEGER,
        comment: '评论用户id',
        allowNull: false
    },
    pid: {
        type: DataTypes.INTEGER,
        comment: '回复评论',
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        comment: '评论内容',
        allowNull: false
    },
    reply_uid:{
        type: DataTypes.INTEGER,
        comment: '回复评论人的uid',
    },
    aid: {
        type: DataTypes.INTEGER,
        comment: '所属文章id',
        allowNull: false,
        field: 'article_id' // ← 显式映射到数据库字段名
    },
    complaint: {
        type: DataTypes.BIGINT,
        comment: '举报数'
    }, 
    like: {
        type: DataTypes.BIGINT,
        comment: '点赞',
        defaultValue: 0
    }

});

module.exports = Comment;