import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/userRouter';
import authRouter from './routes/authRouter';
import { authenticateJWT } from './middleware/authMiddleware';
import dotenv from 'dotenv';
dotenv.config();
import config from './config';

const app = express();

app.use(bodyParser.json());

app.use('/api', authenticateJWT, userRouter);
app.use('/auth', authRouter);

const PORT = config.server.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
