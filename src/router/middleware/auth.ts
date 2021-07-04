import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "로그인상태가 아닙니다.",
    });
  }

  const verifyToken = new Promise((resolve, reject) => {
    jwt.verify(token as string, req.app.get("jwt-secret"), (err: any, decoded: any) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  const onError = (error: any) => {
    res.status(401).json({
      success: false,
      message: error,
    });
  };

  verifyToken.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};