var jwt = require("jsonwebtoken");
var crypto = require("crypto");

/**
 * mysql connection
 */
var mysql_dbc = require("../../../config/mysql-config")();
var connection = mysql_dbc.init();

const hexEncryption = (data) => {
  const digest = crypto.createHash("sha256").update(data).digest("hex");
  return crypto.createHash("sha256").update(digest).digest("hex");
};

/*
  POST /api/auth/register
  {
    userid,
    password,
    username,
    nickname
  }
 */
exports.register = (req, res) => {
  const { userid, password, username, nickname } = req.body;
  const qr = `insert into user(userid, password, username, nickname) values(?, ?, ?, ?)`;
  connection.query(
    qr,
    [userid, hexEncryption(password), username, nickname],
    (err, rows, fld) => {
      if (!err) {
        res.status(201).json({ success: 1, data: rows[0] });
      } else {
        res.status(400).json({
          success: 0,
          error: err,
        });
      }
    }
  );
};

/*
  POST /api/auth/login
  {
    userid,
    password
  }
 */
exports.login = (req, res) => {
  const { userid, password } = req.body;
  const secret = req.app.get("jwt-secret");

  const check = (uid, pwd) => {
    return new Promise((resolve, reject) => {
      const qr = `select userid, password, username, nickname from user where userid = ?`;
      connection.query(qr, [uid], (err, user) => {
        if (err) {
          reject(new Error("login failed"));
        } else if (!user[0]) {
          reject(new Error("id is not exist"));
        } else if (user[0].password !== hexEncryption(pwd)) {
          reject(new Error("password is wrong"));
        } else {
          resolve(user[0]);
        }
      });
    });
  };

  const issueToken = (user) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          userid: user.userid,
          username: user.username,
          nickname: user.nickname,
        },
        secret,
        {
          expiresIn: "10m",
          subject: "userInfo",
        },
        (err, token) => {
          if (err) reject(err);
          resolve(token);
        }
      );
    });
  };

  const respond = (token) => {
    res.json({
      success: 1,
      token,
    });
  };

  const onError = (error) => {
    res.status(403).json({
      message: error.message,
    });
  };

  check(userid, password).then(issueToken).then(respond).catch(onError);
};

/*
  GET /api/auth/check
 */
exports.check = (req, res) => {
  res.json({
    success: 1,
    info: req.decoded,
  });
};
