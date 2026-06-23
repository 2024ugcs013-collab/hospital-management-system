import mongoose from 'mongoose';

export default async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured.');
  }

  mongoose.set('strictQuery', true);
  console.log("MONGO_URI =", process.env.MONGO_URI);
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  
  console.log('MongoDB connected');
}
