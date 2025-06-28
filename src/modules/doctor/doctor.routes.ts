import { Router } from 'express';
import { 
  // updateDoctor, 
  // deleteDoctor,
  addService,
  updateService,
  deleteService,
  getDoctorServices,
  setAvailability,
  getServiceAvailability,
  getDoctorAppointments,
  updateAppointmentStatus,
  getAppointmentById,
  getAvailableTimeSlots
} from './doctor.controller';
import { authenticateToken, requireDoctor } from '../../middleware/auth';

const router = Router();

// Protected routes (authentication required)
router.use(authenticateToken);

// router.put('/:id', updateDoctor);
// router.delete('/:id', deleteDoctor);

// Service management routes
router.post('/:doctorId/services', requireDoctor, addService);
router.patch('/services/:id', requireDoctor, updateService);
router.delete('/services/:id', requireDoctor, deleteService);
router.get('/:doctorId/services', getDoctorServices);

// Availability management routes
router.post('/:doctorId/availability', requireDoctor, setAvailability);
router.get('/services/:serviceId/availability', getServiceAvailability);

// Appointment management routes
router.get('/:doctorId/appointments', requireDoctor, getDoctorAppointments);
router.patch('/appointments/:id/status', requireDoctor, updateAppointmentStatus);
router.get('/appointments/:appointmentId', requireDoctor, getAppointmentById);
router.get('/:doctorId/:serviceId/available-slots/:date', getAvailableTimeSlots);

export default router;