var moment = require("moment");
const { Article, Reply } = require('../../../models');
const { Op } = require('sequelize');

/*
    GET /api/article/count
 */
exports.getCount = async (req, res) => {
  try {
    const count = await Article.count();
    res.json({
      success: 1,
      count,
    });
  } catch(err) {
    res.status(400).json({ error: err });
  }
};

/*
  GET /api/article/list?page=?
 */
exports.getList = async (req, res) => {
  let { page } = req.query;

  try {
    const article = await Article.findAll({
      offset: (page-1)*15,
      limit: 15,
      order: [
        ['article_no', 'DESC']
      ]
    });
    res.json(article);
  } catch(err) {
    res.status(400).json({ error: err });
  }
};

/*
  GET /api/article/read/:id
 */
exports.getArticle = async (req, res) => {
  const articleNo = req.params.id;
  let transaction = null;

  try {
    transaction = await Article.sequelize.transaction();
    const article = await Article.findOne({
      where: {
        article_no: articleNo
      }
    }, { transaction });
    const { view_cnt } = article.dataValues;
    await Article.update({
      view_cnt: view_cnt + 1
    }, {
      where: {
        article_no: articleNo
      }
    }, { transaction });
    transaction.commit();
    res.json(article);
  } catch(err) {
    transaction.rollback();
    res.status(400).json({ error: err });
  }
};

/*
  POST /api/article/write
  {
    title,
    writer,
    content
  }
 */
exports.writeArticle = async (req, res) => {
  const { title, writer, content } = req.body;
  const reg_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  try {
    await Article.create({ title, writer, content, reg_date });
    res.status(201).json({ success: 1 });
  } catch(err) {
    res.status(400).json({ error: err });
  }
};

/*
  PUT /api/article/modify/:id
  {
    title,
    content
  }
 */
exports.modifyArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const reg_date = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

  try {
    await Article.update({ title, content, reg_date }, { where: { article_no: id } });
    res.status(201).json({ success: 1 });
  } catch(err) {
    res.status(400).json({ error: err });
  }
};

/*
  DELETE /api/article/delete/:id
 */
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  let transaction = null;

  try {
    transaction = await Article.sequelize.transaction();
    await Reply.destroy({
      where: {
        article_no: id
      }
    }, { transaction });
    await Article.destroy({
      where: {
        article_no: id
      }
    }, { transaction });
    transaction.commit();
    res.status(204).json({ success: 1 });
  } catch(err) {
    transaction.rollback();
    res.status(400).json({
      success: 0,
      error: err
    });
  }
};

/*
  GET /api/article/search?type=?&keyword=?
 */
exports.search = async (req, res) => {
  const { type, keyword } = req.query;
  console.log(type, keyword);
  const new_keyword = "%" + keyword + "%";

  try {
    let article = {};
    if(type === "everything") {
      article = await Article.findAll({
        where: {
          [Op.or]: [{
            title: {
              [Op.like]: new_keyword
            }
          }, {
            writer: {
              [Op.like]: new_keyword
            }
          }, {
            content: {
              [Op.like]: new_keyword
            }
          }]
        }
      }, {
        order: [
          ['article_no', 'DESC']
        ]
      });
    } else {
      const cond = {};
      cond[type] = { [Op.like]: new_keyword };
      article = await Article.findAll({ where: cond });
    }
    res.json({ success: 1, article });
  } catch(err) {
    res.status(400).json({ success: 0, error: err });
  }
};
