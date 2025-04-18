const { getErrEmoji, getSuccessEmoji } = require('../utils/getResEemoji');

/**
 * 处理响应的中间件
 * @param {Object} req - Express 请求对象
 * @param {Object} res - Express 响应对象
 * @param {Function} next - Express 下一中间件函数
 */
function returnValue(req, res, next) {

  /**
   * 成功响应函数
   * @param {any} [data=null] - 响应的数据，默认为 null
   * @param {string} [message='操作成功'] - 响应的消息内容，默认为 '操作成功'
   * @param {number} [code=200] - 响应的状态码，默认为 200
   * @returns {void} 返回 JSON 格式的响应
   */
  res.success = (data = null, message = '操作成功!', code = 200) => {
    message = message.concat(getSuccessEmoji());  // 修改 message 的值
    // 发送成功响应
    res.json({ code, message, data });
  };

  /**
   * 错误响应函数
   * @param {string} [message='操作失败'] - 错误消息，默认为 '操作失败'
   * @param {number} [code=500] - 错误状态码，默认为 500
   * @param {any} [data=null] - 错误相关数据，默认为 null
   * @returns {void} 返回 JSON 格式的错误响应
   */
  res.error = (message = '操作失败啦', code = 500, data = null) => {
    message = message.concat(getErrEmoji());  // 修改 message 的值
    // 发送错误响应
    res.json({ code, message, data });
  };

  // 调用下一个中间件
  next();
}

module.exports = returnValue;
