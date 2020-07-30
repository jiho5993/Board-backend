var moment = require('moment');

/**
 * mysql connection
 */
var mysql_dbc = require('../../config/mysql-config')();
var connection = mysql_dbc.init();
mysql_dbc.test(connection);


/**
 * GET: get the Article_list
 */
exports.getList = (req, res) => {
  const sql = `select * from article`;
  connection.query(sql, (err, rows, fld) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log('list get ERR' + err);
    }
  });
};

/**
 * GET: read the Article
 */
exports.getArticle = (req, res) => {
  const articleNo = req.params.id;
  const sql = `select * from article where article_no = ?`;
  connection.query(sql, [articleNo], (err, rows, fld) => {
    if(!err) {
      console.log(rows);
      res.json(rows);
    } else {
      console.log('read get ERR' + err);
    }
  });
};

/**
 * POST: write the Article
 */
exports.writeArticle = (req, res) => {
  var result = {};
  const { title, writer, content } = req.body;
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const sql = `insert into article(title, writer, content, reg_date) values (?, ?, ?, ?)`;
  connection.query(sql, [title, writer, content, now], (err, rows, fld) => {
    if(!err) {
      result = { success: 1 };
    } else {
      result = { success: 0, err: err };
    }
    res.json(result);
  });
};

/**
 * PUT: update the Article
 */
exports.modifyArticle = (req, res) => {
  var result = {};
  const { id } = req.params;
  const { title, content } = req.body;
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const sql = `update article set title = ?, content = ?, reg_date = ? where article_no = ?`;
  connection.query(sql, [title, content, now, id], (err, rows, fld) => {
    if(!err) {
      result = { success: 1 };
    } else {
      result = { success: 0, err: err };
    }
    res.json(result);
  });
};

/**
 * DELETE: delete the Article
 */
exports.deleteArticle = (req, res) => {
  var result = {};
  const { id } = req.params;
  const sql = `delete from article where article_no = ?`;
  connection.query(sql, [id], (err, rows, fld) => {
    if(!err) {
      result = { success: 1 };
    } else {
      result = { success: 0, err: err };
    }
    res.json(result);
  });
};