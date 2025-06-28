import { Patient, IPatient } from './patient.model';
import { NotFoundError } from '../../utils/errors';
import { PatientData, PatientUpdateData, PatientResponse } from './patient.interface';

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
}

export const patientService = new PatientService();
