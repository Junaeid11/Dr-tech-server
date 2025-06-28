import { Request, Response } from 'express';
import { patientService } from './patient.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

export const getAllPatients = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const patients = await patientService.getAllPatients();
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patients retrieved successfully!',
    data: patients,
  });
});

export const getPatientById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const patient = await patientService.getPatientById(req.params.id);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient retrieved successfully!',
    data: patient,
  });
});

export const updatePatient = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const patient = await patientService.updatePatient({ id: req.params.id, ...req.body });
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient updated successfully!',
    data: patient,
  });
});

export const deletePatient = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await patientService.deletePatient(req.params.id);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient deleted successfully!',
    data: result,
  });
});
