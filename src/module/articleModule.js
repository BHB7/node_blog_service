const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql');

const Article = mysql.define('article', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        comment: '文章标题',
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT('medium'),
        comment: '文章内容',
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '文章所属用户id'
    },
    classty: {
        type: DataTypes.INTEGER,
        comment: '文章分类'
    },
    desc: {
        type: DataTypes.STRING,
        comment: '文章描述',
        allowNull: false
    },
    cover: {
        type: DataTypes.STRING,
        comment: '文字封面',
    },
    like: {
        type: DataTypes.BIGINT,
        comment: '文章点赞量',
        defaultValue: 0
    },
    ip: {
        type: DataTypes.STRING,
        comment: '发布时的ip地址'
    },
    system: {
        type: DataTypes.STRING,
        comment: '发布时的设备信息'
    },
    state: {
        type: DataTypes.ENUM(['000', '010', '100']),
        comment: '文章状态 000 发布 010 审核 100 草稿'
    },
     click:{
        type: DataTypes.BIGINT,
        comment: '文章浏览量',
        defaultValue: 0
    },
    is_show:{
        type: DataTypes.ENUM(['0', '1']),
        comment: '首页显示 0 隐藏 1 显示'
    },
    head_show:{
        type: DataTypes.ENUM(['0', '1']),
        comment: '标题显示 0 隐藏 1 显示'
    },
    share_show:{
        type: DataTypes.ENUM(['0', '1']),
        comment: '分享显示 0 隐藏 1 显示'
    },
    copyright_show:{
        type: DataTypes.ENUM(['0', '1']),
        comment: '版权显示 0 隐藏 1 显示'
    },
    message_show:{
         type: DataTypes.ENUM(['0', '1']),
        comment: '留言显示 0 隐藏 1 显示'
    },
    seo:{
         type: DataTypes.ENUM(['0', '1']),
        comment: '提交收录 0 隐藏 1 显示'
    }

});

module.exports = Article