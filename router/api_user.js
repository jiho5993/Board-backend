var express = require('express');
var router = express();

/**
 * Mysql Connection module call
 * @type {{init: (function(): Connection), test: test}}
 */
var mysql_dbc = require('../config/mysql-config')();
var connection = mysql_dbc.init();

/**
 * login api
 */
router.get('/login', (req, res) => {
  var { userid, password } = req.query;
  const sql = `select userid, password, username, nickname from user where userid = ? and password = ?`;
  connection.query(sql, [userid, password], (err, rows) => {
    if(!err) {
      if(rows[0] !== undefined) {
        const mem = rows[0];
        req.session.uid = mem.userid;
        req.session.uname = mem.username;
        req.session.nickname = mem.nickname;
        req.session.isLogined = true;
        req.session.save();
        res.json({ success: 1 });
      } else {
        res.json({ success:0, log: 'not found' });
      }
    } else {
      res.json({ success:0, err: err });
    }
  });
});

/**
 * logout api
 */
router.get('/logout', (req, res) => {
  if(req.session.uid) {
    req.session.destroy((err) => {
      if(err) {
        res.json({ success: 0, err: err });
      }
    });
    res.json({ success: 1 });
  }
});

module.exports = router;