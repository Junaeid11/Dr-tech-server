import { Router } from 'express';
import { 
  getAllDoctors, 
  getDoctorById, 
  updateDoctor, 
  deleteDoctor,
  addService,
  updateService,
  deleteService,
  getDoctorServices,
  setAvailability,
  getServiceAvailability,
  getDoctorAppointments,
  updateAppointmentStatus
} from './doctor.controller';

const router = Router();

// Doctor management routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.put('/:id', updateDoctor);
router.delete('/:id', deleteDoctor);

// Service management routes
router.post('/:doctorId/services', addService);
router.patch('/services/:id', updateService);
router.delete('/services/:id', deleteService);
router.get('/:doctorId/services', getDoctorServices);

// Availability management routes
router.post('/:doctorId/availability', setAvailability);
router.get('/services/:serviceId/availability', getServiceAvailability);

// Appointment management routes
router.get('/:doctorId/appointments', getDoctorAppointments);
router.patch('/appointments/:id/status', updateAppointmentStatus);

export default router;