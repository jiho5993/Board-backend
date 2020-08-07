var moment = require('moment');

/**
 * mysql connection
 */
var mysql_dbc = require('../../../config/mysql-config')();
var connection = mysql_dbc.init();
mysql_dbc.test(connection);


/*
  GET /api/article/list
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

/*
  GET /api/article/read/:id
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

/*
  POST /api/article/write
  {
    title,
    writer,
    content
  }
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

/*
  PUT /api/article/modify/:id
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

/*
  DELETE /api/article/delete/:id
 */
exports.deleteArticle = (req, res) => {
  const { id } = req.params;
  const article_qr = `delete from reply where article_no = ?`;
  connection.query(article_qr, [id], (err_1, reply) => {
    if(!err_1) {
      const reply_qr = `delete from article where article_no = ?`;
      connection.query(reply_qr, [id], (err_2, article) => {
        if(!err_2) {
          res.json({ success: 1 });
        } else {
          res.json({
            success: 0,
            error: err_2
          });
        }
      });
    } else {
      res.json({
        success: 0,
        error: err_1
      });
    }
  });
};


/*
  GET /api/article/search
  query {
    type,
    keyword
  }
 */
exports.search = (req, res) => {
  const { type, keyword } = req.query;
  console.log(type, keyword);
  const new_keyword = '%' + keyword + '%';
  if(type === "everything") { // title, writer, content
    const qr = `select * from article where title like ? or writer like ? or content like ?`;
    connection.query(qr, [new_keyword, new_keyword, new_keyword], (err, article) => {
      if(!err) {
        res.json({
          success: 1,
          article: article
        });
      } else {
        res.json({
          success: 0,
          error: err
        });
      }
    });
  } else {
    const qr = `select * from article where ` + type + ` like ?`;
    connection.query(qr, [new_keyword], (err, article) => {
      if(!err) {
        res.json({
          success: 1,
          article: article
        });
      } else {
        res.json({
          success: 0,
          error: err
        });
      }
    });
  }
};