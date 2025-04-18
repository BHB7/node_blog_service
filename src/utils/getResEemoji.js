const errEmoji = ['(＞﹏＜)', '(┬＿┬)↘', '╥﹏╥...', 'o(TヘTo)'];
const successEmoji = ['ヾ(≧▽≦*)o', '✧(≖ ◡ ≖✿)闪~', '(≧∀≦)ゞ', '(p≧w≦q)'];
function getErrEmoji() {
    const i = Math.floor(Math.random() * 4);
    console.log(i);

    return errEmoji[i]
};

function getSuccessEmoji() {
    const i = Math.floor(Math.random() * 4);
    console.log(i);

    return successEmoji[i]
};

module.exports = {
    getErrEmoji,
    getSuccessEmoji
}