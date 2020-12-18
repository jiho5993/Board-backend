import { Router } from 'express';
import { authMiddleware } from '../../../middleware/auth';
import {
  register,
  login,
  check
} from './auth.controller';

export const auth = Router();

auth.post("/register", register);
auth.post("/login", login);

auth.get("/check", authMiddleware, check);