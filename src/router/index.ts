import { Router } from 'express';
import { article } from './api/article/article.index';
import { auth } from './api/auth/auth.index';
import { reply } from './api/reply/reply.index';

export const api = Router();

api.use("/article", article);
api.use("/auth", auth);
api.use("/reply", reply);