var moment = require('moment');

/**
 * mysql connection
 */
var mysql_dbc = require('../../../config/mysql-config')();
var connection = mysql_dbc.init();

/*
  POST /api/reply/write
  {
    id,
    nickname,
    content
  }
 */
exports.write = (req, res) => {
  const { id, nickname, content } = req.body;
  const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  const qr = `insert into reply(article_no, nickname, content, reg_date) values (?, ?, ?, ?)`;
  connection.query(qr, [id, nickname, content, now], (err, reply) => {
    if(err) {
      res.json({
        success: 0,
        error: err
      });
    } else {
      res.json({
        success: 1
      });
    }
  });
};


/*
  GET /api/reply/list/:id
 */
exports.list = (req, res) => {
  const id = req.params.id;
  const list_qr = `select nickname, content, reg_date from reply where article_no = ?`;
  connection.query(list_qr, [id], (err_1, replyList) => {
    if(err_1) {
      res.json({
        success: 0,
        error: err_1
      });
    } else {
      const cnt_qr = `select count(article_no) as count from reply where article_no = ?`;
      connection.query(cnt_qr, [id], (err_2, cnt) => {
        if(err_2) {
          res.json({
            success: 0,
            error: err_2
          });
        } else {
          res.json({
            success: 1,
            count: cnt[0].count,
            reply: replyList
          });
        }
      });
    }
  });
};