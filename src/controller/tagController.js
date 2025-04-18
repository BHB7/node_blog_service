const { getTagService, createTagService, deleteTagService } = require('../service/tagService');

const getTagController = async (req, res) => {
  try {

    const data = await getTagService(req);
    res.success(data);
  } catch (error) {
    res.error('获取标签失败');
  }
}
const createTagController = async (req, res) => {
  const { name } = req.body || req.query;
  if(!name) return res.error('哎哟，参数不太乖，得再检查一下哦~')
  try {
    const data = await createTagService(req);
    res.success(data);
  } catch (error) {
    res.error('创建标签失败啦');
  }
}
const deleteTagController = async (req, res) => {
  const { tid } = req.body || req.query;
  if (!tid) return res.error('参数不合法 ');
  try {
    await deleteTagService(req);
  } catch (error) {
    res.error('删除标签失败啦');
  }
}

module.exports = {
  getTagController,
  deleteTagController,
  createTagController
}