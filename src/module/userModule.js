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
    mail: DataTypes.STRING,
    imgurl: DataTypes.STRING,
    ip: DataTypes.STRING,
    system: DataTypes.STRING
});


module.exports = User