import { Router } from 'express';
import {
  getCount,
  getList,
  getArticle,
  writeArticle,
  modifyArticle,
  deleteArticle,
  search
} from './article.controller';
import { authMiddleware } from '../../middleware/auth';

export const article = Router();

article.get("/count", getCount);
article.get("/list", getList);
article.get("/read/:id", getArticle);
article.post("/write", authMiddleware, writeArticle);
article.put("/modify/:id", modifyArticle);
article.delete("/delete", authMiddleware, deleteArticle);
article.get("/search", search);