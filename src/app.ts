import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './modules/auth/auth.routes';
import doctorRoutes from './modules/doctor/doctor.routes';
import patientRoutes from './modules/Patient/patient.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Welcome route - serves the HTML landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Doctor-Patient Appointment API',
    version: '1.3.0',
    description: 'A comprehensive REST API for managing doctor-patient appointments',
    developer: 'Junaeid Ahmed Tanim',
    contact: 'junaeidahmed979@gmail.com',
    portfolio: 'https://noobwork.me',
    endpoints: {
      authentication: {
        'POST /auth/register-doctor': 'Register a new doctor',
        'POST /auth/register-patient': 'Register a new patient',
        'POST /auth/login': 'Login (doctor or patient)'
      },
      patients: {
        'GET /patients/doctor': 'Get all doctors',
        'POST /patients/appointments': 'Book appointment',
        'GET /patients/appointments': 'Get patient appointments'
      },
      doctors: {
        'GET /doctors/:id/appointments': 'Get doctor appointments',
        'PATCH /doctors/appointments/:id/status': 'Update appointment status',
        'POST /doctors/:id/services': 'Add service',
        'POST /doctors/:id/availability': 'Set availability'
      }
    }
  });
});


// Routes
app.use('/auth', authRoutes);
app.use('/doctors', doctorRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/doctor-patient-db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

export default app; 