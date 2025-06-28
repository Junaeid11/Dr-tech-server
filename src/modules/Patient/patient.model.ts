import { Schema, model, Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  gender: string;
  role: 'patient';
}

const PatientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  role: { type: String, default: 'patient' },
});

export const Patient = model<IPatient>('Patient', PatientSchema); 