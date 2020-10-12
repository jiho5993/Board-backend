var moment = require("moment");

/**
 * mysql connection
 */
var mysql_dbc = require("../../../config/mysql-config")();
var connection = mysql_dbc.init();
mysql_dbc.test(connection);

/*
    GET /api/article/count
 */
exports.getCount = (req, res) => {
  const sql = `select count(*) as count from article`;
  connection.query(sql, (err, article) => {
    if (!err) {
      res.json({
        success: 1,
        data: article[0],
      });
    } else {
      res.status(400).json({ error: err });
    }
  });
};

/*
  GET /api/article/list?page=?
 */
exports.getList = (req, res) => {
  let { page } = req.query;
  const sql = `select * from article order by article_no desc limit ?, 15`;
  connection.query(sql, [(page - 1) * 15], (err, rows) => {
    if (!err) {
      res.json(rows);
    } else {
      res.status(400).json({ error: err });
    }
  });
};

/*
  GET /api/article/read/:id
 */
exports.getArticle = (req, res) => {
  const articleNo = req.params.id;
  const read_sql = `select * from article where article_no = ?`;
  connection.query(read_sql, [articleNo], (err, rows) => {
    if (!err) {
      console.log(rows);
      incViewCount(articleNo, rows[0].view_cnt, rows);
    } else {
      res.status(400).json({ error: err });
      console.log("read get ERR" + err);
    }
  });

  const incViewCount = (id, view_cnt, result) => {
    const view_sql = `update article set view_cnt = ? where article_no = ?`;
    connection.query(view_sql, [view_cnt + 1, id], (err) => {
      if (!err) {
        res.json(result);
      } else {
        res.status(400).json({ error: err });
        console.log(err);
      }
    });
  };
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
  const { title, writer, content } = req.body;
  const now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const sql = `insert into article(title, writer, content, reg_date) values (?, ?, ?, ?)`;
  connection.query(sql, [title, writer, content, now], (err) => {
    if (!err) {
      res.status(201).json({ success: 1 });
    } else {
      res.status(400).json({ error: err });
    }
  });
};

/*
  PUT /api/article/modify/:id
 */
exports.modifyArticle = (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
  const sql = `update article set title = ?, content = ?, reg_date = ? where article_no = ?`;
  connection.query(sql, [title, content, now, id], (err) => {
    if (!err) {
      res.status(201).json({ success: 1 });
    } else {
      res.status(400).json({ error: err });
    }
  });
};

/*
  DELETE /api/article/delete/:id
 */
exports.deleteArticle = (req, res) => {
  const { id } = req.params;
  const article_qr = `delete from reply where article_no = ?`;
  connection.query(article_qr, [id], (err_1) => {
    if (!err_1) {
      const reply_qr = `delete from article where article_no = ?`;
      connection.query(reply_qr, [id], (err_2) => {
        if (!err_2) {
          res.status(204).json({ success: 1 });
        } else {
          res.status(400).json({
            success: 0,
            error: err_2,
          });
        }
      });
    } else {
      res.status(400).json({
        success: 0,
        error: err_1,
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
  const new_keyword = "%" + keyword + "%";
  if (type === "everything") {
    // title, writer, content
    const qr = `select * from article where title like ? or writer like ? or content like ? order by article_no desc`;
    connection.query(
      qr,
      [new_keyword, new_keyword, new_keyword],
      (err, article) => {
        if (!err) {
          res.json({
            success: 1,
            article: article,
          });
        } else {
          res.status(400).json({
            success: 0,
            error: err,
          });
        }
      }
    );
  } else {
    const qr =
      `select * from article where ` +
      type +
      ` like ? order by article_no desc`;
    connection.query(qr, [new_keyword], (err, article) => {
      if (!err) {
        res.json({
          success: 1,
          article: article,
        });
      } else {
        res.status(400).json({
          success: 0,
          error: err,
        });
      }
    });
  }
};
