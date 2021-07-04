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

  const check = (uid: string, pwd: string): Promise<User> => {
    return new Promise<User>(async (resolve, reject) => {
      try {
        const user = await User.findOne({
          where: {
            userid: uid
          }
        });
        if(user === null) {
          reject(new Error("등록되지 않은 유저입니다."));
        } else if(user.password !== hexEncryption(pwd)) {
          reject(new Error("잘못된 비밀번호입니다."));
        } else {
          resolve(user);
        }
      } catch (e) {
        reject(e);
      }
    });
  };

  const issueToken = (user: User) => {
    return new Promise((resolve, reject) => {
      let accessToken = jwt.sign(
        {
          uid: user.userid,
          name: user.username,
          nickname: user.nickname
        },
        secret,
        {
          expiresIn: "10s"
        }
      );
      let refreshToken = jwt.sign(
        {},
        secret,
        {
          expiresIn: "20s"
        }
      );
      resolve({accessToken, refreshToken, user});
    });
  };

  const handlingToken = async (info: any) => {
    const user: User = info.user;
    const { accessToken, refreshToken } = info;

    try {
      await user.update({ token: refreshToken } );
      res.cookie('accessToken', accessToken, {
        maxAge: 1000*10,
        httpOnly: true
      });
      res.cookie('refreshToken', refreshToken, {
        maxAge: 1000*20,
        httpOnly: true
      });
      res.status(200).json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(401).json({ success: false });
    }
  };

  check(userid, password)
    .then(issueToken)
    .then(handlingToken)
    .catch((e) => {
      res.status(401).json({
        success: false,
        err: e.message
      });
    });
};

/*
  GET /api/auth/check
 */
export const check = (req: Request, res: Response) => {
  res.json({
    success: true,
    info: req.decoded,
  });
};