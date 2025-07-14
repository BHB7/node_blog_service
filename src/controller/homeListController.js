const { addHomeDataService, delHomeDataService, getHomeDataListService } = require("../service/homeListService");

// cover 背景
// title 标题
// info 介绍
// deleted_at 是否显示 0 1
// link
const addHomeDataController = async (req, res) => {
  const { cover, title, info, link } = req.body;
  try {
    const response = await addHomeDataService({
      title:title,
      link:link,
      cover:cover,
      info:info,
    });
    res.success(response, "设置成功");
  } catch (error) {
    console.log(error.message);
    res.error("ADD失败啦");
  }
};
const delHomeDataController = async (req, res) => {
  const { id } = req.query;
  if(id.trim() === '') return res.error('id不能为空');
  try {
    const response = await delHomeDataService(id);
    res.success(response, "DEL成功");
  } catch (error) {
    console.log(error.message);
    res.error("DEL失败啦");
  }
};


async function getHomeDataListController(req, res) {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10; // 或者从 req.body 中取

  try {
    const result = await getHomeDataListService(page, pageSize);
    res.success(result, '欧克拉');
  } catch (error) {
    res.error('获取首页数据失败');
  }
}

module.exports = {
    addHomeDataController,
    delHomeDataController,
    getHomeDataListController
}