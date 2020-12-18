import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"] || req.query.token;

  if (!token) {
    return res.status(403).json({
      success: 0,
      message: "not logged in",
    });
  }

  const issueToken = new Promise((resolve, reject) => {
    jwt.verify(token as string, req.app.get("jwt-secret"), (err: any, decoded: any) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  const onError = (error: any) => {
    res.status(403).json({
      success: 0,
      message: error.message,
    });
  };

  issueToken.then((decoded) => {
    req.decoded = decoded;
    next();
  }).catch(onError);
};