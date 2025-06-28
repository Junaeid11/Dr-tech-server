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

export const bookAppointment = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { doctorId, serviceId, selectedDate, timeSlot, scheduledDate, scheduledTime } = req.body;
  const patientId = req.user?.id; 

  if (!patientId) {
    sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  // Support both field name formats
  const appointmentDate = selectedDate || scheduledDate;
  const appointmentTime = timeSlot || scheduledTime;

  // Validate required fields
  if (!doctorId || !serviceId || !appointmentDate || !appointmentTime) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: 'Missing required fields: doctorId, serviceId, and either (selectedDate, timeSlot) or (scheduledDate, scheduledTime)',
    });
    return;
  }

  // Parse the date
  const parsedDate = new Date(appointmentDate);
  if (isNaN(parsedDate.getTime())) {
    sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: 'Invalid date format',
    });
    return;
  }

  const appointment = await patientService.bookAppointment(
    patientId,
    doctorId,
    serviceId,
    parsedDate,
    appointmentTime
  );

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Appointment booked successfully',
    data: appointment
  });
});

export const getAllDoctors = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const doctors = await patientService.getAllDoctors();
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctors retrieved successfully!',
    data: doctors,
  });
});

export const getDoctorById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const doctor = await patientService.getDoctorById(req.params.id);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctor retrieved successfully!',
    data: doctor,
  });
});

export const getPatientAppointments = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const patientId = req.user?.id; // From JWT middleware
  const { status } = req.query;

  if (!patientId) {
    sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: 'Authentication required',
    });
    return;
  }

  const appointments = await patientService.getPatientAppointments(patientId, status as string);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Patient appointments retrieved successfully!',
    data: appointments,
  });
});