import { Schema, model, Document } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  specialization: string;
  hospitalName: string;
  hospitalFloor: string;
  role: 'doctor';
}

const DoctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  hospitalName: { type: String, required: true },
  hospitalFloor: { type: String, required: true },
  role: { type: String, default: 'doctor' },
});

export const Doctor = model<IDoctor>('Doctor', DoctorSchema); 