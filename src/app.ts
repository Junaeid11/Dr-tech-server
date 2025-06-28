import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import doctorRoutes from './modules/doctor/doctor.routes';
import patientRoutes from './modules/Patient/patient.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);
app.use('/patients', patientRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/doctor-patient-db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

export default app; 