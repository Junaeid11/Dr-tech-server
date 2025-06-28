import { Request, Response } from 'express';
import { doctorService } from './doctor.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { StatusCodes } from "http-status-codes";

export const getAllDoctors = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const doctors = await doctorService.getAllDoctors();
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctors retrieved successfully!',
    data: doctors,
  });
});

export const getDoctorById = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const doctor = await doctorService.getDoctorById(req.params.id);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctor retrieved successfully!',
    data: doctor,
  });
});

export const updateDoctor = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const doctor = await doctorService.updateDoctor({ id: req.params.id, ...req.body });
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctor updated successfully!',
    data: doctor,
  });
});

export const deleteDoctor = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await doctorService.deleteDoctor(req.params.id);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctor deleted successfully!',
    data: result,
  });
});

// Service Management Controllers
export const addService = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const service = await doctorService.addService({
    ...req.body,
    doctorId: req.params.doctorId || req.body.doctorId
  });
  
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Service added successfully!',
    data: service,
  });
});

export const updateService = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const service = await doctorService.updateService({
    id: req.params.id,
    ...req.body
  });
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service updated successfully!',
    data: service,
  });
});

export const deleteService = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await doctorService.deleteService(req.params.id);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service deleted successfully!',
    data: result,
  });
});

export const getDoctorServices = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const services = await doctorService.getDoctorServices(req.params.doctorId);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Doctor services retrieved successfully!',
    data: services,
  });
});


export const setAvailability = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const availability = await doctorService.setAvailability({
    ...req.body,
    doctorId: req.params.doctorId || req.body.doctorId
  });
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Availability set successfully!',
    data: availability,
  });
});

export const getServiceAvailability = catchAsync(async(req,res)=> {
  const availability = await doctorService.getServiceAvailability(req.params.serviceId);
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Service availability retrieved successfully!',
    data: availability,
  });
});

// Appointment Management Controllers
export const getDoctorAppointments = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { status } = req.query;
  const appointments = await doctorService.getDoctorAppointments(
    req.params.doctorId, 
    status as any
  );
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Appointments retrieved successfully!',
    data: appointments,
  });
});

export const updateAppointmentStatus = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const { status, doctorNotes } = req.body;
  const appointment = await doctorService.updateAppointmentStatus(
    req.params.id,
    status,
    doctorNotes
  );
  
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Appointment status updated successfully!',
    data: appointment,
  });
});
