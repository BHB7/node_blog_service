const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql');



const list = [
    {
    desc: '疑问',
    url: 'https://vocucd.cn/emoji/031%25402x.gif'
    },
    {
    desc: '擦汗',
    url: 'https://vocucd.cn/emoji/071%25402x.gif'
    },
    {
    desc: '抠鼻',
    url: 'https://vocucd.cn/emoji/072%25402x.gif'
    },
    {
    desc: '哭泣',
    url: 'https://vocucd.cn/emoji/146%25402x.gif'
    },
    {
    desc: '满足',
    url: 'https://vocucd.cn/emoji/148%25402x.gif'
    },
    {
    desc: '喷血',
    url: 'https://vocucd.cn/emoji/150%25402x.gif'
    },
    {
    desc: '搓你',
    url: 'https://vocucd.cn/emoji/154%25402x.gif'
    },
    {
    desc: '熊熊点赞',
    url: 'https://vocucd.cn/emoji/172%25402x.gif'
    },
    {
    desc: '熊熊吃',
    url: 'https://vocucd.cn/emoji/175%25402x.gif'
    },
    {
    desc: '托腮',
    url: 'https://vocucd.cn/emoji/182%25402x.gif'
    },
]
const Emoji = mysql.define('emoji', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url:{
         type: DataTypes.STRING,
         comment: '表情包链接',
         allowNull: false
    },
    desc: {
        type: DataTypes.STRING,
        comment: '表情包描述',
        allowNull: false
    }

});

module.exports = Emoji;