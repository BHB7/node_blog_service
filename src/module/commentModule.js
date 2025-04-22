const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql')


const Comment = mysql.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        comment: '评论用户id',
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        comment: '评论内容',
        allowNull: false
    },
    article_id: {
        type: DataTypes.INTEGER,
        comment: '所属文章id',
        allowNull: false
    },
    complaint: {
        type: DataTypes.BIGINT,
        comment: '举报数'
    }

});

module.exports = Comment