import { Request, Response } from 'express';
import { Doctor } from '../models/doctor.model';
import { Patient } from '../models/patient.model';
import { hashPassword, comparePassword } from '../utils/hash';
import { signJwt } from '../utils/jwt';

export const registerDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, specialization, hospitalName, hospitalFloor } = req.body;
    const existing = await Doctor.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }
    const hashed = await hashPassword(password);
    const doctor = new Doctor({
      name,
      email,
      phone,
      password: hashed,
      specialization,
      hospitalName,
      hospitalFloor,
      role: 'doctor',
    });
    await doctor.save();
    res.status(201).json({ message: 'Doctor registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const registerPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, age, gender } = req.body;
    const existing = await Patient.findOne({ email });
    if (existing) {
      res.status(400).json({ message: 'Email already registered' });
      return;
    }
    const hashed = await hashPassword(password);
    const patient = new Patient({
      name,
      email,
      phone,
      password: hashed,
      age,
      gender,
      role: 'patient',
    });
    await patient.save();
    res.status(201).json({ message: 'Patient registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    let user = await Doctor.findOne({ email });
    let role = 'doctor';
    if (!user) {
      user = await Patient.findOne({ email });
      role = 'patient';
    }
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    const token = signJwt({ id: user._id, role });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
}; 