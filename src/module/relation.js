const Article = require('./articleModule');
const Tag = require('./tagModule');
const Comment = require('../module/commentModule');
const Albums = require('../module/albumsModule');
const Photos = require('../module/photosModule');
const User = require('../module/userModule');

const FriendLinks = require('../module/friendLinksModule');

/**关系表 */

// ========================
// Article <-> Tag (多对多)
// ========================
Article.belongsToMany(Tag, {
    through: 'article_tags',
    as: 'tags',
    foreignKey: 'article_id'
});

Tag.belongsToMany(Article, {
    through: 'article_tags',
    as: 'articles',
    foreignKey: 'tag_id'
});

// ========================
// Article <-> Comment (一对多)
// ========================
Article.hasMany(Comment, {
    as: 'comments',
    foreignKey: 'article_id'
});

Comment.belongsTo(Article, {
    as: 'article',
    foreignKey: 'article_id'
});

// 关联到 User 模型
Comment.belongsTo(User, {
  foreignKey: 'uid',
  as: 'user'
});
// ========================
// Albums <-> photos  (一对多)
// ========================
Albums.hasMany(Photos, {
    as: 'photos',
    foreignKey: 'albums_id'
});
Photos.belongsTo(Albums, {
    as: 'albums',
    foreignKey: 'albums_id'
});

// ========================
// User <-> FriendLinks  (一对一) 表示一个用户有一个友链
// ========================

User.hasOne(FriendLinks,{
    foreignKey: 'userId',
     as: 'friendLink' 
});
// 表示一个友链属于一个用户
FriendLinks.belongsTo(User,{
     foreignKey: 'userId',
    as: 'user'
});