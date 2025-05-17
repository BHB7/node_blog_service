const { DataTypes } = require('sequelize')
const mysql = require('../db/mysql')



const GuestBook = mysql.define('guestbook', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content:{
        type: DataTypes.STRING,
        comment: '留言内容',
         allowNull: false
    },
    uid:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    like:{
        type: DataTypes.BIGINT,
        comment: '点赞',
        defaultValue: 0
    }
})