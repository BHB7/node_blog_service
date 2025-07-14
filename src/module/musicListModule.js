const { DataTypes } = require("sequelize");
const mysql = require("../db/mysql");

const MusicList = mysql.define("musicList", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "音乐标题",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "音乐作者",
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: "音乐类型",
  },
  deleted_at: {
    type: DataTypes.CHAR,
    allowNull: false,
    comment: "是否显示 0 1",
  },
});


module.exports = MusicList;