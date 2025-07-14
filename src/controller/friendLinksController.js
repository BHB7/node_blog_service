const {
  addFriendLinkService,
  getFriendLinkListService,
  updatedFriendLinkService,
} = require("../service/friendLinksService");

const addFriendLinkController = async (req, res) => {
  console.log(req.body);
  const { name, link, cover, info, type } = req.body;
  // 从 JWT 中获取用户 ID
  const user_id = req.auth?.id || req.user?.id; // 兼容 req.auth 和 req.user

  try {
    const response = await addFriendLinkService(user_id, {
      name,
      link,
      cover,
      info,
      type,
    });
    res.success(response, "申请成功");
  } catch (error) {
    console.log(error.message);

    res.error("添加友联失败啦");
  }
};

async function getFriendLinkListController(req, res) {
  const { page = 1, pageSize = 10 } = req.query;
  const limit = parseInt(pageSize, 10);
  const offset = (parseInt(page, 10) - 1) * limit;

  try {
    const listData = await getFriendLinkListService(limit, offset);

    res.success(
      {
        ...listData.data,
        current_page: listData.current_page,
        last_page: listData.last_page,
        total: listData.total,
      },
      "获取成功"
    );
  } catch (err) {
    console.error("获取友链失败:", err);
    res.status(500).json({
      code: 500,
      message: "服务器内部错误",
    });
  }
}


// 更新友链
async function updateFriendLinkController(req, res) {
  try {
    const { id } = req.body; // 从 URL 获取 fid
    const updateData = req.body; // 从请求体获取更新内容

    const result = await updatedFriendLinkService(
      parseInt(id, 10),
      updateData
    );
    res.success(result);
  } catch (err) {
    console.error("更新友链失败:", err);
    res.error('更新友链失败', 500);
  }
}

// 显示隐藏友链
async function setFriendLinkShowController(req, res) {
  try {
    const {id, isShow} = req.body; // 从请求体获取更新内容

    const result = await updatedFriendLinkService(
      parseInt(id, 10),
      {isShow}
    );
    res.success(result);
  } catch (err) {
    console.error("更新友链失败:", err);
    res.error('更新友链失败', 500);
  }
};


module.exports = {
  addFriendLinkController,
  getFriendLinkListController,
  updateFriendLinkController,
  setFriendLinkShowController
};
