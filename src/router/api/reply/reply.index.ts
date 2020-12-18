import { Router } from 'express';
import {
  write,
  list,
  deleteReply,
  modifyReply,
  getOneReply
} from './reply.controller';

export const reply = Router();

reply.post("/write", write);
reply.get("/list/:id", list);
reply.delete("/delete/:id", deleteReply);
reply.put("/modify", modifyReply);
reply.get("/get-reply/:id", getOneReply);