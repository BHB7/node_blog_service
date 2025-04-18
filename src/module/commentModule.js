const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql')


const Comment = mysql.define('comment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id:{
        type:DataTypes.INTEGER,
        comment: '评论用户id'
    },
    content:{
        type: DataTypes.STRING,
        comment: '评论内容'
    },
    article_id: {
        type:DataTypes.INTEGER,
        comment: '所属文章id'
    },
    complaint:{
        type: DataTypes.BIGINT,        
        comment: '举报数'
    },
    label_id:{
        type: DataTypes.INTEGER,
        comment: '文章标签id'
    },
    desc:{
        type: DataTypes.STRING,
        comment: '文章描述'
    },
    cover:{
        type:DataTypes.STRING,
        comment: '文字封面'
    },
    view: {
        type: DataTypes.BIGINT,
        comment: '文章浏览量'
    },
    state: {
        type: DataTypes.ENUM(['000', '001', '100']),
        comment: '文章状态 000 发布 010 审核 100 草稿'
    }

});

module.exports = Comment