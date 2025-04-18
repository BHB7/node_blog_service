const nodemailer = require('nodemailer');
const {config} = require('./getConfig')
// 创建邮件发送器
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // 使用SSL
  auth: {
    user: 'dev12306@qq.com',
    pass: config.key_mail
  }
});

/**
 * 发送邮件
 * @param {Object} options - 邮件参数
 * @param {string|string[]} options.to - 接收者邮箱
 * @param {string} options.subject - 邮件标题
 * @param {string} [options.text] - 纯文本内容
 * @param {string} [options.html] - HTML 内容
 * @param {Array} [options.attachments] - 附件数组（可选）
 */
const sendMail = async ({ to, subject, text = '', html = '', attachments = [] }) => {
  const mailOptions = {
    from: '"7z DEV" <dev12306@qq.com>',
    to,
    subject,
    text,
    html,
    attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`邮件已发送：${info.messageId}`);
    return info;
  } catch (err) {
    console.error('发送邮件失败:', err.message);
    throw new Error('发送邮件失败:', err.message);
  }
};

module.exports = sendMail;
