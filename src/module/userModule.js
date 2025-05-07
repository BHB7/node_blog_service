const mysql = require('../db/mysql');
const { DataTypes } = require('sequelize');

const User = mysql.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type:DataTypes.STRING,
        // 不允许为null
        allowNull: false, 
    },
    password:DataTypes.STRING,
    age: DataTypes.INTEGER,
    email: DataTypes.STRING,
    imgurl: DataTypes.STRING,
    ip: DataTypes.STRING,
    gender:{
        type: DataTypes.ENUM(["0", "1"]),
        comment: '性别 0 男  1 女'
    },
    motto: {
        type:DataTypes.STRING,
        comment: '个性签名'
    },
    system: DataTypes.STRING,
    githubId:{
        type: DataTypes.STRING,
        comment: 'github第三方登录'
    },
    token:{
        type: DataTypes.STRING,
        comment: 'github第三方登录鉴权信息'
    }

});


module.exports = User