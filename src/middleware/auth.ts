import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import { AuthenticationError } from '../utils/errors';
import { Doctor } from '../modules/doctor/doctor.model';
import { Patient } from '../modules/Patient/patient.model';

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader; // Fallback for direct token

    if (!token) {
      throw new AuthenticationError('Access token is required');
    }

    const decoded = verifyJwt(token) as any;
    if (!decoded) {
      throw new AuthenticationError('Invalid or expired token');
    }

    // Verify user exists in database
    let user;
    if (decoded.role === 'doctor') {
      user = await Doctor.findById(decoded.id).select('-password');
    } else if (decoded.role === 'patient') {
      user = await Patient.findById(decoded.id).select('-password');
    }

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    // Attach user info to request
    req.user = {
      id: (user._id as any).toString(),
      role: decoded.role
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AuthenticationError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthenticationError('Insufficient permissions');
    }

    next();
  };
};

export const requirePatient = requireRole(['patient']);
export const requireDoctor = requireRole(['doctor']); 