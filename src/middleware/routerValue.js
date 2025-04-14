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
  res.success = (data = null, message = '操作成功', code = 200) => {
      // 打印成功响应的日志，帮助调试
      console.log(`返回成功: ${message}, code: ${code}`);
      console.log('返回数据:', data);

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
  res.error = (message = '操作失败', code = 500, data = null) => {
      // 打印错误响应的日志，帮助调试
      console.log(`返回失败: ${message}, code: ${code}`);
      console.log('错误数据:', data);

      // 发送错误响应
      res.json({ code, message, data });
  };

  // 调用下一个中间件
  next();
}

module.exports = returnValue;
