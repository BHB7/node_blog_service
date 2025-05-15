const { default: axios } = require("axios");

/**
 * 获取播放地址
 * @param {number} musicID 音乐ID
 */
const getPlayUrl = async (musicID) => {
    try {
        const response = await axios.get('https://mobi.kuwo.cn/mobi.s?f=web&source=jiakong&type=convert_url_with_sign', {
            params: {
                rid: musicID,
            }
        });
        // console.log(`获取播放地址成功: ${response.data.data.url}`);
        return response.data.data.url; // 假设返回的数据中包含播放地址
    } catch (error) {
        console.error(`获取播放地址失败: ${error.message}`);
        return null;
    }
}


const searchController = async (req, res, next) => {

    // pn 当前页码 rn 返回多少条
    const { pn = 0, rn = 20, all } = req.query || req.body;
    console.log(all, pn, rn);
    try {
        const response = await axios.get('http://search.kuwo.cn/r.s', {
            params: {
                all: req.query.all,
                ft: 'music',
                itemset: 'web_2013',
                client: 'kt',
                pn,
                rn,
                rformat: 'json',
                encoding: 'utf8',
                uid: 794762570,
                ver: 'kwplayer_ar_9.2.2.1',
                vipver: 1,
                vermerge: 1,
                show_copyright_off: 1,
                newver: 1,
                cluster: 0,
                strategy: 2012,
                mobi: 1,
                issubtitle: 1,
                _: +new Date().getTime()
            }
        });

        let list = [];
        let data = response.data;
        if (typeof data === 'string') {
            // 将字符串中的单引号替换为双引号 方便解析json
            const dataStr = data.replace(/\'/g, '"');

            // 将字符串解析为json
            data = JSON.parse(dataStr.replace(/\&nbsp;/g, ' ').replace(/\&/g, ' / '));
        }
        // console.log(data.abslist);

        if (data.abslist) {
            // 整合数据 通过rid获取播放地址
            list = await Promise.all(data.abslist.map(async item => {
                const url = await getPlayUrl(item.DC_TARGETID);
                // console.log(`获取到的播放地址: ${url}`);
                return {
                    name: item.NAME,
                    artist: item.ARTIST,
                    album: item.ALBUM,
                    pic: item.PIC,
                    rid: item.DC_TARGETID,
                    url: url,
                    // 歌曲封面
                    cover: `https://img1.kuwo.cn/star/albumcover/${item.web_albumpic_short}`.replace(/120/g, '500')
                };
            }));
        }

        res.success(list, '搜索成功');
    } catch (err) {
        res.error('搜索失败: ' + err.message);
    }
}

module.exports = {
    searchController
}