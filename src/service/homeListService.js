const HomeList = require("../module/homeListModule");

// cover 背景
// title 标题
// info 介绍
// deleted_at 是否显示 0 1
// link
async function addHomeDataService({ title, cover, info, link }) {
  try {
    const homeData = await HomeList.create({
      title: title,
      link: link,
      cover: cover,
      info: info,
    });
  } catch (error) {
    console.log("首页数据添加失败", error.message);
    throw new Error("ADD失败");
  }
}

// DEL
async function delHomeDataService(id) {
  try {
    const isOk = await HomeList.destroy({ where: { id } });
    if (isOk <= 0) throw new Error("DEL失败");
    return isOk;
  } catch (error) {
    console.log("DEL失败", error.message);
    throw new Error("DEL失败");
  }
}

// LIST
/**
 * 获取首页列表数据（分页）
 * @param {number} page - 当前页码，默认为 1
 * @param {number} pageSize - 每页数量，默认为 10
 * @returns {Promise<Object>} 分页数据结果
 */
async function getHomeDataListService(page = 1, pageSize = 10) {
  try {
    const offset = (page - 1) * pageSize;

    // 查询分页数据和总数
    const result = await HomeList.findAndCountAll({
      limit: pageSize,
      offset: offset,
      order: [["id", "DESC"]], // 按照 id 降序排列
    });

    // 构造返回数据
    return {
      list: result.rows,
      current_page: Math.floor(offset / pageSize) + 1,
      last_page: Math.ceil(result.count / pageSize),
      total: result.count,
    };
  } catch (error) {
    console.error("获取首页列表失败:", error);
    throw new Error("服务器内部错误");
  }
}

module.exports = {
  addHomeDataService,
  delHomeDataService,
  getHomeDataListService
};
