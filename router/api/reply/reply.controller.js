var moment = require("moment");

/**
 * mysql connection
 */
var mysql_dbc = require("../../../config/mysql-config")();
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
    const now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    const qr = `insert into reply(article_no, nickname, content, reg_date) values (?, ?, ?, ?)`;
    connection.query(qr, [id, nickname, content, now], (err, reply) => {
        if (err) {
            res.status(400).json({
                success: 0,
                error: err
            });
        } else {
            res.status(201).json({ success: 1 });
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
        if (err_1) {
            res.status(400).json({
                success: 0,
                error: err_1,
            });
        } else {
            const cnt_qr = `select count(article_no) as count from reply where article_no = ?`;
            connection.query(cnt_qr, [id], (err_2, cnt) => {
                if (err_2) {
                    res.status(400).json({
                        success: 0,
                        error: err_2,
                    });
                } else {
                    res.json({
                        success: 1,
                        count: cnt[0].count,
                        reply: replyList,
                    });
                }
            });
        }
    });
};

/*
  DELETE /api/reply/delete/:id
 */
exports.deleteReply = (req, res) => {
    const id = req.params.id;
    const qr = `delete from reply where reply_no = ?`;
    connection.query(qr, [id], (err) => {
        if(err) {
            res.status(400).json({
                success: 0,
                error: err
            });
        } else {
            res.status(204).json({ success: 1 });
        }
    });
};

/*
  PUT /api/reply/modify
  {
    reply_no
    content
  }
 */
exports.modifyReply = (req, res) => {
    const { reply_no, content } = req.body;
    const qr = `update reply set content = ? where reply_no = ?`;
    connection.query(qr, [content, reply_no], (err, rep) => {
        if(err) {
            res.status(400).json({
                success: 0,
                error: err
            });
        } else {
            res.status(201).json({
                success: 1,
                result: rep
            });
        }
    });
};