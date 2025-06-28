import { Types } from 'mongoose';

export interface DoctorData {
  name: string;
  email: string;
  phone: string;
  specialization: string;
  hospitalName: string;
  hospitalFloor: string;
}

export interface DoctorUpdateData extends Partial<DoctorData> {
  id: string;
}

export interface DoctorResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  hospitalName: string;
  hospitalFloor: string;
  role: string;
}

// Service Management Interfaces
export interface ServiceData {
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
  doctorId: string | Types.ObjectId;
}

export interface ServiceUpdateData extends Partial<ServiceData> {
  id: string;
}

export type ServiceResponse = any; // MongoDB document type

// Availability Management Interfaces
export interface TimeSlot {
  startTime: string; // "10:00"
  endTime: string;   // "12:00"
}

export interface DayAvailability {
  day: string; // "monday", "tuesday", etc.
  timeSlots: TimeSlot[];
  isAvailable: boolean;
}

export interface AvailabilityData {
  serviceId: string | Types.ObjectId;
  doctorId: string | Types.ObjectId;
  weeklySchedule: DayAvailability[];
}

export type AvailabilityResponse = any; // MongoDB document type

// Appointment Management Interfaces
export type AppointmentStatus = 'pending' | 'accepted' | 'cancelled' | 'completed';

export interface AppointmentData {
  serviceId: string | Types.ObjectId;
  doctorId: string | Types.ObjectId;
  patientId: string | Types.ObjectId;
  scheduledDate: Date;
  scheduledTime: string;
  status: AppointmentStatus;
  patientNotes?: string;
  doctorNotes?: string;
}

export type AppointmentResponse = any; // MongoDB document type
