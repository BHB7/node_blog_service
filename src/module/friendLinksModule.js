const { DataTypes } = require("sequelize");
const mysql = require("../db/mysql");

// 友链模型
const Friend_links = mysql.define("friend_links", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "友链名称",
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "友链链接",
  },
  cover: {
    type: DataTypes.STRING,
    comment: "友链封面",
  },
  info: {
    type: DataTypes.STRING,
    comment: "友链介绍",
  },
  type: {
    type: DataTypes.CHAR,
    comment: "类型 0 网站 | 项目"
  },
  isShow:{
     type: DataTypes.BOOLEAN,
     defaultValue: false,
     comment: "是否显示"
  },
  click: {
    type: DataTypes.BIGINT,
    defaultValue: 0,
    comment: "获赞数",
  },
});

module.exports = Friend_links;
