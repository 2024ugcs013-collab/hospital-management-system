import cors from 'cors';
import express from 'express';

import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import prescriptionRoutes from './routes/prescriptionRoutes.js';
import storeRoutes from './routes/storeRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { seedDatabase } from './controllers/seedController.js';
import {
  errorMiddleware,
  notFoundMiddleware,
} from './middleware/errorMiddleware.js';

const app = express();

/* -----------------------------------------
   CORS Configuration
------------------------------------------ */

const allowedOrigins = [
  'http://localhost:5173',
  'https://2024ugcs013-collab.github.io',
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow Postman, mobile apps, server-to-server requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

/* -----------------------------------------
   Middleware
------------------------------------------ */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -----------------------------------------
   Health Check
------------------------------------------ */

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'Server is running',
  });
});

/* -----------------------------------------
   API Routes
------------------------------------------ */

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/store', storeRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/seed', seedDatabase);

/* -----------------------------------------
   Error Handling
------------------------------------------ */

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;