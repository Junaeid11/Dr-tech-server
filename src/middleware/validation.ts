import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export const validateDoctorRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, phone, password, specialization, hospitalName, hospitalFloor } = req.body;

  if (!name || !email || !phone || !password || !specialization || !hospitalName || !hospitalFloor) {
    throw new ValidationError('All fields are required');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  next();
};

export const validatePatientRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, phone, password, age, gender } = req.body;

  if (!name || !email || !phone || !password || !age || !gender) {
    throw new ValidationError('All fields are required');
  }

  if (password.length < 6) {
    throw new ValidationError('Password must be at least 6 characters long');
  }

  if (age < 0 || age > 150) {
    throw new ValidationError('Invalid age');
  }

  if (!['male', 'female', 'other'].includes(gender.toLowerCase())) {
    throw new ValidationError('Invalid gender');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }

  next();
}; 