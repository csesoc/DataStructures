import { Router } from 'express';
import healthRouter from './health';
import authRouter from './auth';
import quizRouter from './quiz';

export const router = Router();

router.use('/', healthRouter, authRouter, quizRouter);
