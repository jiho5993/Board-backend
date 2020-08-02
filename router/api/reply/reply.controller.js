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
  const qr = `select nickname, content, reg_date from reply where article_no = ?`;
  connection.query(qr, [id], (err, replyList) => {
    if(err) {
      res.json({
        success: 0,
        error: err
      });
    } else {
      res.json({
        success: 1,
        reply: replyList
      });
    }
  });
};