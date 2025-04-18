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
        type: DataTypes.STRING,
        comment: '文章内容',
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '文章所属用户id'
    },
    subset_id: {
        type: DataTypes.INTEGER,
        comment: '文章分类id'
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
    view: {
        type: DataTypes.BIGINT,
        comment: '文章浏览量'
    },
    state: {
        type: DataTypes.ENUM(['000', '010', '100']),
        comment: '文章状态 000 发布 010 审核 100 草稿'
    }

});

module.exports = Article