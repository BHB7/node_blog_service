const mysql = require('../db/mysql');
const { DataTypes } = require('sequelize');

const Overall = mysql.define('overall', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: '总揽名称'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '使用值'
    }
});

module.exports = Overall;