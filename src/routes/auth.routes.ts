import { Router } from 'express';
import { registerDoctor, registerPatient, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register-doctor', registerDoctor);
router.post('/register-patient', registerPatient);
router.post('/login', login);

export default router; 