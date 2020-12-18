import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../../../model/User';

const hexEncryption = (data: string) => {
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
export const register = async (req: Request, res: Response) => {
  const { userid, password, username, nickname }: any = req.body;

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
export const login = (req: Request, res: Response) => {
  const { userid, password } = req.body;
  const secret = req.app.get("jwt-secret");

  const check = (uid: string, pwd: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({
          where: {
            userid: uid
          }
        });
        if(user === null) {
          reject(new Error("ID does not exist."));
        } else if(user.password !== hexEncryption(pwd)) {
          reject(new Error("Wrong password."));
        } else {
          resolve(user);
        }
      } catch(err) {
        reject(new Error("Login Failed"));
      }
    });
  };

  const issueToken: any = (user: any) => {
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

  const respond: any = (token: string) => {
    res.json({
      success: 1,
      token,
    });
  };

  const onError = (error: any) => {
    res.status(403).json({
      message: error.message,
    });
  };

  check(userid, password)
  .then(issueToken)
  .then(respond)
  .catch(onError);
};

/*
  GET /api/auth/check
 */
export const check = (req: Request, res: Response) => {
  res.json({
    success: 1,
    info: req.decoded,
  });
};