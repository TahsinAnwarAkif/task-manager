import express from 'express';
import morgan from 'morgan';
import path from 'path';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import {connectDB} from './config/db.js';
import {notFound, errorHandler} from './middlewares/error.js';
import taskRoutes from './routes/task.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';

connectDB();

export const app = express();

const __dirname = path.resolve();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 100
});
app.use(limiter);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/users', userRoutes);

app.use(notFound);
app.use(errorHandler);
