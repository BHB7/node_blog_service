const { getTagService } = require('../service/tagService');
const { getArticlePageService } = require('../service/articleService');
const { bucketInfo } = require('../utils/opOssFile');



const getTotalInfoController = async (req,res) => {
    const tagTotal = new Promise((resolve, reject) => {
        getTagService({ tid: '', desc: '', name: '' }).then((res) => {
            console.log(res[0].dataValues);

            resolve({
                name: 'tag',
                zh: '标签',
                total: res.length,
                list: res[0].dataValues
            })
        }).catch((err) => {
            reject(err)
        })
    });

    const articleTotal = new Promise((resolve, reject) => {
        getArticlePageService().then((res) => {
            resolve({
                name: 'article',
                zh: '文章',
                ...res
            })
        }).catch((err) => {
            reject(err)
        })
    });
    const bucketTotal = new Promise((resolve, reject) => {
        bucketInfo().then((res) => {
            resolve({
                name: 'bucket',
                zh: 'OSS本地文件',
                ...res
            })
        }).catch((err) => {
            reject(err)
        })
    });
    try {
        const pall = await Promise.all([tagTotal, articleTotal, bucketTotal]);
        const infoList = pall.map(item => {
            return {
                name: item.name,
                total: item.total,
                zh: item.zh
            };
        });

        res.success(infoList);
    } catch (error) {
        console.log('获取总揽信息失败了:', error.message );
        res.error('获取总揽信息失败啦, 呜呜呜');
        
    };
};

module.exports = {
    getTotalInfoController
};