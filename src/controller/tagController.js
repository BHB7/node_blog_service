const { getTagService, createTagService, deleteTagService } = require('../service/tagService');

const getTagController = async (req, res) => {
  const reqAllType = req.body || req.query;
  try {
    const data = await getTagService(reqAllType);
    res.success(data);
  } catch (error) {
    res.error('获取标签失败');
  };
};
const createTagController = async (req, res) => {
  const reqAllType = req.body || req.query;
  if (!reqAllType.name) return res.error('哎哟，参数不太乖，得再检查一下哦~');
  try {
    const data = await createTagService(reqAllType);
    res.success(data);
  } catch (error) {
    res.error(error.message);
  };
};
const deleteTagController = async (req, res) => {
  const reqAllType = req.body || req.query;
  if (!reqAllType.tid) return res.error('参数不合法 ');
  try {
    await deleteTagService(reqAllType);
  } catch (error) {
    res.error('删除标签失败啦');
  };
};

module.exports = {
  getTagController,
  deleteTagController,
  createTagController
};