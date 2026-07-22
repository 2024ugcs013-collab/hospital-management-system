import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { ensureDefaultAdmin } from './src/utils/bootstrapAdmin.js';

dotenv.config();

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    await ensureDefaultAdmin();
  } catch (error) {
    console.warn('MongoDB connection unavailable. Starting API server without a live database connection.');
    console.warn(error.message);
  }

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer();
