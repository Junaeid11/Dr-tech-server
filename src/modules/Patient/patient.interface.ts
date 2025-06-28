import { Schema, Document } from 'mongoose';
export interface PatientData {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
}

export interface PatientUpdateData extends Partial<PatientData> {
  id: string;
}

export interface PatientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  role: string;
}
