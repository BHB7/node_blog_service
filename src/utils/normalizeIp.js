// 辅助函数：规范化 IP 地址
function normalizeIp(ip) {
    if (!ip) return 'Unknown IP';
    if (ip.startsWith('::ffff:')) {
        return ip.replace('::ffff:', ''); // 去掉 IPv6 的前缀
    }
    return ip;
};

module.exports = normalizeIp;