import { Request, Response } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { StatusCodes } from "http-status-codes";
export const registerDoctor = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.registerDoctor(req.body);
  
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Doctor registered successfully!',
    data: result,
  });
});

export const registerPatient = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.registerPatient(req.body);
  
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'Patient registered successfully!',
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const result = await authService.login(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'User logged in successfully!',
    data: {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
  });
}); 