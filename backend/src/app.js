import cors from 'cors';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import { errorMiddleware, notFoundMiddleware } from './middleware/errorMiddleware.js';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
