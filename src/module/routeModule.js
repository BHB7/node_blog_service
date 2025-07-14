const { DataTypes } = require("sequelize");
const mysql = require("../db/mysql");

// 成长时间线
/// category 类别
// logo LOGO链接
// content 内容
// data 成长日期

const Route = mysql.define("route", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "类别",
  },
  logo: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "logo",
  },
  data: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "成长日期",
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "内容",
  },
  deleted_at: {
    type: DataTypes.CHAR,
    allowNull: false,
    comment: "是否显示 0 1",
  },
});

module.exports = Route;
