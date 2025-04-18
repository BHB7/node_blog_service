// relation 关系
const Article = require('./articleModule');
const Tag = require('./tagModule');


// 建立表关联

// 中间表：article_tags
Article.belongsToMany(Tag, {
    through: 'article_tags',
    as: 'tags', // 别名（和后面 include 时一致）
    foreignKey: 'article_id'
});

Tag.belongsToMany(Article, {
    through: 'article_tags',
    as: 'articles',
    foreignKey: 'tag_id'
});