import { Router } from 'express';
import healthRouter from './health';
import authRouter from './auth';
import lessonRouter from './lesson';
import quizRouter from './quiz';
import topicRouter from './topic';

export const router = Router();

router.use(
    '/',
    healthRouter,
    authRouter,
    quizRouter,
    lessonRouter,
    topicRouter
);
