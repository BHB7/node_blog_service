const { getTagService } = require('../service/tagService');
const { getArticlePageService } = require('../service/articleService');
const { bucketInfo } = require('../utils/opOssFile');

const getTotalInfoController = async (req, res) => {
    const tagTotal = new Promise((resolve, reject) => {
        getTagService({ tid: '', desc: '', name: '' })
            .then((res) => {
                if (!res || res.length === 0) {
                    resolve({
                        name: 'tag',
                        zh: '标签',
                        total: 0,
                        list: []
                    });
                } else {
                    resolve({
                        name: 'tag',
                        zh: '标签',
                        total: res.length,
                        list: res[0]?.dataValues || {}
                    });
                }
            })
            .catch((err) => {
                console.error('Error in getTagService:', err.message);
                reject(err);
            });
    });

    const articleTotal = new Promise((resolve, reject) => {
        getArticlePageService()
            .then((res) => {
                resolve({
                    ...res,
                    name: 'article',
                    zh: '文章',
                    total: res?.total || 0
                });
            })
            .catch((err) => {
                console.error('Error in getArticlePageService:', err.message);
                reject(err);
            });
    });

    const bucketTotal = new Promise((resolve, reject) => {
        bucketInfo()
            .then((res) => {
                resolve({
                    name: 'bucket',
                    zh: 'OSS本地文件',
                    total: res?.total || 0,
                    ...res
                });
            })
            .catch((err) => {
                console.error('Error in bucketInfo:', err.message);
                reject(err);
            });
    });

    try {
        const pall = await Promise.all([tagTotal, articleTotal, bucketTotal]);
        const infoList = pall.map(item => {
            let add = null; // 使用 let 声明，允许动态修改
        
            switch (item.name) {
                case 'article':
                    add = { path: '/admin/posts' };
                    break;
                case 'tag':
                    add = { path: '/admin/articles' };
                    break;
                default:
                    add = false; // 默认情况下没有路径
                    break;
            }
        
            return {
                name: item.name,
                total: item.total || 0,
                zh: item.zh,
                add // 动态生成的 add 属性
            };
        });

        res.success(infoList);
    } catch (error) {
        console.log('获取总揽信息失败了:', error.message);
        res.error(`获取总揽信息失败啦, 呜呜呜`);
    }
};

module.exports = {
    getTotalInfoController
};