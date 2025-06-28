import { Doctor, IDoctor } from '../doctor/doctor.model';
import { Patient, IPatient } from '../Patient/patient.model';
import { hashPassword, comparePassword } from '../../utils/hash';
import { signJwt } from '../../utils/jwt';
import { ConflictError, AuthenticationError } from '../../utils/errors';
import { 
  DoctorRegistrationData, 
  PatientRegistrationData, 
  LoginData, 
  AuthResponse 
} from './auth.interface';

export class AuthService {
  async registerDoctor(data: DoctorRegistrationData): Promise<{ message: string }> {
    const existing = await Doctor.findOne({ email: data.email });
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const hashed = await hashPassword(data.password);
    const doctor = new Doctor({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashed,
      specialization: data.specialization,
      hospitalName: data.hospitalName,
      hospitalFloor: data.hospitalFloor,
      role: 'doctor',
    });

    await doctor.save();
    return { message: 'Doctor registered successfully' };
  }

  async registerPatient(data: PatientRegistrationData): Promise<{ message: string }> {
    const existing = await Patient.findOne({ email: data.email });
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const hashed = await hashPassword(data.password);
    const patient = new Patient({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashed,
      age: data.age,
      gender: data.gender,
      role: 'patient',
    });

    await patient.save();
    return { message: 'Patient registered successfully' };
  }

  async login(data: LoginData): Promise<AuthResponse> {
    let user: IDoctor | IPatient | null = await Doctor.findOne({ email: data.email });
    let role = 'doctor';

    if (!user) {
      user = await Patient.findOne({ email: data.email });
      role = 'patient';
    }

    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isMatch = await comparePassword(data.password, user.password);
    if (!isMatch) {
      throw new AuthenticationError('Invalid credentials');
    }

    const accessToken = signJwt({ id: user._id, role });
    const refreshToken = signJwt({ id: user._id, role, type: 'refresh' }, 7 * 24 * 60 * 60);
    
    return { 
      accessToken, 
      refreshToken, 
      role, 
      id: (user._id as any).toString() 
    };
  }
}

export const authService = new AuthService();
