import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import userRouter from './userRouter';
import authRouter from './authRouter';

const router = express.Router();

router.use('/users', authenticateJWT, userRouter);
router.use('/auth', authRouter);

export default router;