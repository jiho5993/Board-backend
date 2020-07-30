/**
 * mysql connection
 */
var mysql_dbc = require('../../config/mysql-config')();
var connection = mysql_dbc.init();


/**
 * POST: register
 */
exports.register = (req, res) => {
  const { uid, pwd, uname, nickname } = req.body;
  const qr = `insert into user(userid, password, username, nickname) values(?, ?, ?, ?)`;
  connection.query(qr, [uid, pwd, uname, nickname], (err, rows, fld) => {
    if(!err) {
      res.json({ success: 1 });
    } else {
      res.json({
        success: 0,
        error: err
      });
    }
  });
};

/**
 * POST: login
 */
