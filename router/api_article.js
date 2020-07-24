var express = require('express');
var router = express.Router();

/**
 * Mysql Connection module call
 * @type {{init: (function(): Connection), test: test}}
 */
var mysql_dbc = require('../config/mysql-config')();
var connection = mysql_dbc.init();
mysql_dbc.test(connection);

router.get('/list', (req, res) => {
  const sql = `select * from article`;
  connection.query(sql, (err, row, fld) => {
    if(!err) {
      res.json(row);
    } else {
      console.log('list get ERR' + err);
    }
  })
});

router.get('/about', (req, res) => {
  res.send("about api page.");
});

module.exports = router;