import { Schema, model, Document, Types } from 'mongoose';

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

// Service Model
export interface IService extends Document {
  title: string;
  description: string;
  price: number;
  duration: number;
  doctorId: Types.ObjectId;
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 15 }, // minimum 15 minutes
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
}, { timestamps: true });

export const Service = model<IService>('Service', ServiceSchema);

// Availability Model
export interface IAvailability extends Document {
  serviceId: Types.ObjectId;
  doctorId: Types.ObjectId;
  weeklySchedule: Array<{
    day: string;
    timeSlots: Array<{
      startTime: string;
      endTime: string;
    }>;
    isAvailable: boolean;
  }>;
}

const AvailabilitySchema = new Schema<IAvailability>({
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  weeklySchedule: [{
    day: { type: String, required: true, enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] },
    timeSlots: [{
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }],
    isAvailable: { type: Boolean, default: true }
  }]
}, { timestamps: true });

export const Availability = model<IAvailability>('Availability', AvailabilitySchema);

// Appointment Model
export interface IAppointment extends Document {
  serviceId: Types.ObjectId;
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  scheduledDate: Date;
  scheduledTime: string;
  status: 'pending' | 'accepted' | 'cancelled' | 'completed';
  patientNotes?: string;
  doctorNotes?: string;
}

const AppointmentSchema = new Schema<IAppointment>({
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  scheduledDate: { type: Date, required: true },
  scheduledTime: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'cancelled', 'completed'], default: 'pending' },
  patientNotes: { type: String },
  doctorNotes: { type: String }
}, { timestamps: true });

export const Appointment = model<IAppointment>('Appointment', AppointmentSchema); 