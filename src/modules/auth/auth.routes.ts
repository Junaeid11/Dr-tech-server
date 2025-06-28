import { Router } from 'express';
import { registerDoctor, registerPatient, login } from './auth.controller';
import { 
  validateDoctorRegistration, 
  validatePatientRegistration, 
  validateLogin 
} from '../../middleware/validation';

const router = Router();

router.post('/register-doctor', validateDoctorRegistration, registerDoctor);
router.post('/register-patient', validatePatientRegistration, registerPatient);
router.post('/login', validateLogin, login);

export default router;