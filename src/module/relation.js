const Article = require('./articleModule');
const Tag = require('./tagModule');
const Comment = require('../module/commentModule');
const Albums = require('../module/albumsModule');
const Photos = require('../module/photosModule');
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