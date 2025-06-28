import { Router } from 'express';
import { getAllPatients, getPatientById, updatePatient, deletePatient } from './patient.controller';

const router = Router();

router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;