const FriendLinks = require("../module/friendLinksModule");
const User = require("../module/userModule");

// 添加友链
async function addFriendLinkService(uid, { name, link, cover, info, type }) {
  try {
    // 1. 查找用户是否存在
    const user = await User.findOne({ where: { id: uid } });
    if (!user) {
      throw new Error("用户不存在");
    }

    // 2. 创建友链记录
    const newFriendLink = await FriendLinks.create({
      name,
      link,
      cover,
      info,
      type,
    });

    // 3. 建立用户与友链的关系（假设是一对一或一对多）
    await user.setFriendLink(newFriendLink); // 注意：取决于你在模型中定义的关联名称

    // 4. 返回新增的友链
    return newFriendLink;
  } catch (error) {
    console.error("添加友链失败:", error);
    throw error;
  }
}

// 获取友链列表
async function getFriendLinkListService(limit, offset) {
  //   const limit = pageSize;
  //   const offset = (page - 1) * limit;

  try {
    const result = await FriendLinks.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
      attributes: [
        "id",
        "name",
        "link",
        "cover",
        "info",
        "isShow",
        "type",
        "userId",
        "createdAt",
      ],
    });

    const currentPage = Math.floor(offset / limit) + 1; // ✅ 计算当前页码
    const totalPages = Math.ceil(result.count / limit); // ✅ 总页数

    return {
      data:{
        list: [...result.rows],// ✅ 返回数组格式的数据
        current_page: currentPage, // ✅ 当前页码
        last_page: totalPages, // ✅ 总页数
        total: result.count, // ✅ 总数据量
      },
    };
  } catch (error) {
    console.error("获取友链失败:", error);
    throw error;
  }
}


// 更新友链
async function updatedFriendLinkService(fid, newValue) {
  try {
    // 查找目标友链
    const friendLink = await FriendLinks.findByPk(fid);
    if (!friendLink) {
      throw new Error("未找到对应的友链");
    }
    // 更新数据
    await friendLink.update(newValue);
    return friendLink;
  } catch (error) {
    console.error('更新友链失败:', error);
    throw new Error("服务器内部错误");
  }
}
module.exports = {
  addFriendLinkService,
  getFriendLinkListService,
  updatedFriendLinkService
};
