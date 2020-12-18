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

export const article = Router();

article.get("/count", getCount);
article.get("/list", getList);
article.get("/read/:id", getArticle);
article.post("/write", writeArticle);
article.put("/modify/:id", modifyArticle);
article.delete("/delete/:id", deleteArticle);
article.get("/search", search);