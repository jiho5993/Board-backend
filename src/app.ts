import express from 'express';
import logger from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { SECRET_KEY } from './config/jwt.config';
import { api } from './router';

const expressSession = require('express-session');

dotenv.config();
export const app = express();

app.set('jwt-secret', SECRET_KEY);

/**
 * middleware
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(expressSession({
  resave: true,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true
  }
}));

/**
 * router api
 * article: /api/article/*
 * auth: /api/auth/*
 * reply: /api/reply/*
 */
app.use("/api", api);

/**
 * error status(404, 500)
 */
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(404).send("일치하는 주소가 없습니다.");
});
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send("서버 에러.");
});