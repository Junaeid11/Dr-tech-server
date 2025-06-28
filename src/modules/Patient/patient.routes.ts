import { Router } from 'express';
import { getAllPatients, getPatientById, updatePatient, deletePatient, getAllDoctors, getDoctorById, bookAppointment, getPatientAppointments } from './patient.controller';
import { authenticateToken, requirePatient } from '../../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/', getAllPatients);

// Protected routes (authentication required)
router.use(authenticateToken);

// Doctor management routes - must come before /:id routes
router.get('/doctor', getAllDoctors);
router.get('/doctor/:id', getDoctorById);
router.get('/appointments', requirePatient, getPatientAppointments);
router.post('/appointments', requirePatient, bookAppointment);

// // Patient management routes (admin only or own profile)
// router.get('/:id', getPatientById);
// router.put('/:id', updatePatient);
// router.delete('/:id', deletePatient);

export default router;