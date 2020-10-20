var jwt = require("jsonwebtoken");
var crypto = require("crypto");
const { User } = require('../../../models');

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
exports.register = async (req, res) => {
  const { userid, password, username, nickname } = req.body;

  try {
    await User.create({
      userid,
      password: hexEncryption(password),
      username,
      nickname
    });
    res.status(201).json({ success: 1 });
  } catch(err) {
    res.status(400).json({ success: 0, error: err });
  }
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
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({
          where: {
            userid: uid
          }
        });
        if(user === null) {
          reject(new Error("id is not exist"));
        } else if(user.password !== hexEncryption(pwd)) {
          reject(new Error("password is wrong"));
        } else {
          resolve(user);
        }
      } catch(err) {
        reject(new Error("login failed"));
      }
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
