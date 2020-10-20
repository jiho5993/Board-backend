var path = require("path");
var Sequelize = require("sequelize");

var env = process.env.NODE_ENV || "development";
var config = require(path.join(__dirname, "..", "config", "sequelize-config.js"))[env];
var db = {};

var sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require("./user")(sequelize, Sequelize);
db.Article = require("./article")(sequelize, Sequelize);
db.Reply = require("./reply")(sequelize, Sequelize);

db.Article.hasMany(db.Reply, { foreignKey: 'article_no', sourceKey: 'article_no' });
db.Reply.belongsTo(db.Article, { foreignKey: 'article_no', sourceKey: 'article_no' });

module.exports = db;
