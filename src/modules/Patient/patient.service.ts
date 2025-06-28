import { Patient, IPatient } from './patient.model';
import { NotFoundError } from '../../utils/errors';
import { PatientData, PatientUpdateData, PatientResponse } from './patient.interface';
import { Appointment, Doctor, IAppointment, Service } from '../doctor/doctor.model';
import { DoctorResponse } from '../doctor/doctor.interface';

export class PatientService {
  async getAllPatients(): Promise<PatientResponse[]> {
    const patients = await Patient.find({}, { password: 0 });
    return patients.map(patient => ({
      id: (patient._id as any).toString(),
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      role: patient.role
    }));
  }

  async getPatientById(id: string): Promise<PatientResponse> {
    const patient = await Patient.findById(id, { password: 0 });
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    return {
      id: (patient._id as any).toString(),
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      role: patient.role
    };
  }

  async updatePatient(data: PatientUpdateData): Promise<PatientResponse> {
    const patient = await Patient.findByIdAndUpdate(
      data.id,
      { $set: data },
      { new: true, select: '-password' }
    );

    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    return {
      id: (patient._id as any).toString(),
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      role: patient.role
    };
  }

  async deletePatient(id: string): Promise<{ message: string }> {
    const patient = await Patient.findByIdAndDelete(id);
    if (!patient) {
      throw new NotFoundError('Patient not found');
    }

    return { message: 'Patient deleted successfully' };
  }

   async bookAppointment(
      patientId: string,
      doctorId: string,
      serviceId: string,
      selectedDate: Date,
      timeSlot: string
    ): Promise<IAppointment> {
      
      const existingAppointment = await Appointment.findOne({
        doctorId,
        scheduledDate: selectedDate,
        scheduledTime: timeSlot,
        status: { $nin: ['cancelled'] }
      });
  
      if (existingAppointment) {
        throw new Error('This time slot is already booked');
      }
  
      // Validate that doctor exists
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }
  
      // Validate that service exists
      const service = await Service.findById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }
  
      // Validate that patient exists
      const patient = await Patient.findById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }
  
      // Create appointment with pending status
      const appointment = new Appointment({
        patientId,
        doctorId,
        serviceId,
        scheduledDate: selectedDate,
        scheduledTime: timeSlot,
        status: 'pending'
      });
  
      return await appointment.save();
    }
  async getAllDoctors(): Promise<DoctorResponse[]> {
        const doctors = await Doctor.find({}, { password: 0 });
        return doctors.map(doctor => ({
          id: (doctor._id as any).toString(),
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          specialization: doctor.specialization,
          hospitalName: doctor.hospitalName,
          hospitalFloor: doctor.hospitalFloor,
          role: doctor.role
        }));
      }
    
 async getDoctorById(id: string): Promise<DoctorResponse> {
        const doctor = await Doctor.findById(id, { password: 0 });
        if (!doctor) {
          throw new NotFoundError('Doctor not found');
        }
    
        return {
          id: (doctor._id as any).toString(),
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          specialization: doctor.specialization,
          hospitalName: doctor.hospitalName,
          hospitalFloor: doctor.hospitalFloor,
          role: doctor.role
        };
      }

  /**
   * Get all appointments for a specific patient
   */
  async getPatientAppointments(patientId: string, status?: string): Promise<IAppointment[]> {
    const filter: any = { patientId };
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('doctorId', 'name specialization hospitalName')
      .populate('serviceId', 'title description price')
      .sort({ scheduledDate: 1, scheduledTime: 1 });

    return appointments;
  }
}

export const patientService = new PatientService();
