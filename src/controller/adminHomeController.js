const { getTagService } = require("../service/tagService");
const {
  getArticlePageService,
  getArticleAllbrowseService,
} = require("../service/articleService");
const { getCommentsService } = require("../service/comentService");
const { bucketInfo } = require("../utils/opOssFile");
const { loginService, getUserAllService } = require("../service/userService");
// const getTotalInfoController = async (req, res) => {
//   const tagTotal = new Promise((resolve, reject) => {
//     getTagService({ tid: "", desc: "", name: "" })
//       .then((res) => {
//         if (!res || res.length === 0) {
//           resolve({
//             name: "tag",
//             zh: "标签",
//             total: 0,
//             list: [],
//           });
//         } else {
//           resolve({
//             name: "tag",
//             zh: "标签",
//             total: res.length,
//             list: res[0]?.dataValues || {},
//           });
//         }
//       })
//       .catch((err) => {
//         console.error("Error in getTagService:", err.message);
//         reject(err);
//       });
//   });

//   const articleTotal = new Promise((resolve, reject) => {
//     getArticlePageService()
//       .then((res) => {
//         resolve({
//           ...res,
//           name: "article",
//           canAdd: true,
//           zh: "文章",
//           total: res?.total || 0,
//         });
//       })
//       .catch((err) => {
//         console.error("Error in getArticlePageService:", err.message);
//         reject(err);
//       });
//   });

//   const bucketTotal = new Promise((resolve, reject) => {
//     bucketInfo()
//       .then((res) => {
//         resolve({
//           name: "bucket",
//           zh: "OSS本地文件",
//           total: res?.total || 0,
//           ...res.length,
//         });
//       })
//       .catch((err) => {
//         console.error("Error in bucketInfo:", err.message);
//         reject(err);
//       });
//   });

//   const userRegTotal = new Promise((resolve, reject) => {
//     getUserAllService()
//       .then((res) => {
//         console.log(res);

//         resolve({
//           name: "user",
//           total: res,
//         });
//       })
//       .catch((err) => {
//         console.error("Error in user:", err.message);
//         reject(err);
//       });
//   });
//   const articleAllBrowseTotal = new Promise((resolve, reject) => {
//     getArticleAllbrowseService()
//       .then((res) => {
//         console.log(res);

//         resolve({
//           name: "browse",
//           total: res.total,
//         });
//       })
//       .catch((err) => {
//         console.error("Error in user:", err.message);
//         reject(err);
//       });
//   });

//   const articleAllMessageTotal = new Promise((resolve, reject) => {
//     getCommentsService()
//       .then((res) => {
//         console.log(res.totalItems);

//         resolve({
//           name: "message",
//           total: res.totalItems,
//         });
//       })
//       .catch((err) => {
//         console.error("Error in user:", err.message);
//         reject(err);
//       });
//   });

//   try {
//     const pall = await Promise.all([
//     //   tagTotal,
//       articleTotal,
//     //   bucketTotal,
//       userRegTotal,
//       articleAllBrowseTotal,
//       articleAllMessageTotal,
//     ]);
//     const infoList = pall.map((item) => {
//       switch (item.name) {
//         // 文章总数
//         case "article":
//           item.statistics = "文章总数";
//           item.article = item.total;
//           break;
//         // 留言总数
//         case "message":
//           item.statistics = "留言总数";
//           item.message = item.total;
//           break;
//         // 注册总数
//         case "user":
//           item.statistics = "注册总数";
//           item.user = item.total;
//           break;
//         // 阅读总数
//         case "browse":
//           item.statistics = "阅读总数";
//           item.browse = item.total;
//           break;
//         default:
//           // item.canAdd = false; // 默认情况下没有路径
//           break;
//       }

//       return {
//         quantity: {
//             [item.name]: item,
//         },
//         statistics: item.statistics

//       };
//     });

//     res.success(infoList);
//   } catch (error) {
//     console.log("获取总揽信息失败了:", error.message);
//     res.error(`获取总揽信息失败啦, 呜呜呜`);
//   }
// };

const getTotalInfoController = async (req, res) => {
  try {
    const [articleRes, userRes, browseRes, messageRes] = await Promise.all([
      getArticlePageService(), // 文章总数
      getUserAllService(), // 用户注册数
      getArticleAllbrowseService(), // 阅读总数
      getCommentsService(), // 留言总数（假设 comment 包括留言+回复）
    ]);

    // 假设留言和回复都在 comments 表中，通过 type 字段区分
    const messageCount = messageRes.totalItems || 0;
    const replyCount = messageRes.replyCount || 0; // 如果有的话

    const statistics = {
      user: userRes.total || 0, // 注册用户数
      message: messageCount, // 留言数量
      reply: replyCount, // 回复数量（可选）
      article: articleRes.total || 0, // 文章总数
    };
    const quantity = {
      user: userRes.total || 0, // 注册用户数
      message: messageCount, // 留言数量
      browse: browseRes.total,
      article: articleRes.total || 0, // 文章总数
    };
    res.success({
      statistics,
      quantity,
    });
  } catch (error) {
    console.error("获取总览信息失败:", error.message);
    res.error(`获取总览信息失败啦, 呜呜呜`);
  }
};

const adminLoginController = async (req, res) => {
  try {
    const userInfo = await loginService(req.body);
    res.success(userInfo, "登录成功！");
  } catch (error) {
    res.error(`${error.message}`);
  }
};
module.exports = {
  getTotalInfoController,
  adminLoginController,
};
