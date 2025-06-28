import { Doctor, IDoctor, Service, IService, Availability, IAvailability, Appointment, IAppointment } from './doctor.model';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { 
  DoctorData, 
  DoctorUpdateData, 
  DoctorResponse,
  ServiceData,
  ServiceUpdateData,
  ServiceResponse,
  AvailabilityData,
  AvailabilityResponse,
  AppointmentData,
  AppointmentResponse,
  AppointmentStatus
} from './doctor.interface';

export class DoctorService {
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

  async updateDoctor(data: DoctorUpdateData): Promise<DoctorResponse> {
    const doctor = await Doctor.findByIdAndUpdate(
      data.id,
      { $set: data },
      { new: true, select: '-password' }
    );

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

  async deleteDoctor(id: string): Promise<{ message: string }> {
    const doctor = await Doctor.findByIdAndDelete(id);
    if (!doctor) {
      throw new NotFoundError('Doctor not found');
    }

    return { message: 'Doctor deleted successfully' };
  }

  async addService(data: ServiceData): Promise<ServiceResponse> {
    try {
      const service = new Service({
        title: data.title,
        description: data.description,
        price: data.price,
        duration: data.duration,
        doctorId: data.doctorId
      });

      await service.save();
      return service;
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        throw new ValidationError(`Validation failed: ${validationErrors.join(', ')}`);
      }
      throw error;
    }
  }

  async updateService(data: ServiceUpdateData): Promise<ServiceResponse> {
    const service = await Service.findByIdAndUpdate(
      data.id,
      { $set: data },
      { new: true }
    );

    if (!service) {
      throw new NotFoundError('Service not found');
    }

    return service;
  }

  async deleteService(id: string): Promise<{ message: string }> {
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      throw new NotFoundError('Service not found');
    }

    await Availability.deleteMany({ serviceId: id });

    return { message: 'Service deleted successfully' };
  }

  async getDoctorServices(doctorId: string): Promise<ServiceResponse[]> {
    const services = await Service.find({ doctorId });
    return services;
  }

  async setAvailability(data: AvailabilityData): Promise<AvailabilityResponse> {
    let availability = await Availability.findOne({ 
      serviceId: data.serviceId, 
      doctorId: data.doctorId 
    });

    if (availability) {
      availability.weeklySchedule = data.weeklySchedule;
      await availability.save();
    } else {
      availability = new Availability({
        serviceId: data.serviceId,
        doctorId: data.doctorId,
        weeklySchedule: data.weeklySchedule
      });
      await availability.save();
    }

    return availability;
  }

  async getServiceAvailability(serviceId: string): Promise<AvailabilityResponse | null> {
    const availability = await Availability.findOne({ serviceId });
    return availability;
  }

  async getDoctorAppointments(doctorId: string, status?: AppointmentStatus): Promise<AppointmentResponse[]> {
    const filter: any = { doctorId };
    if (status) {
      filter.status = status;
    }

    const appointments = await Appointment.find(filter)
      .populate('serviceId', 'title')
      .populate('patientId', 'name')
      .sort({ scheduledDate: 1, scheduledTime: 1 });

    return appointments;
  }

  async updateAppointmentStatus(appointmentId: string, status: AppointmentStatus, doctorNotes?: string): Promise<AppointmentResponse> {
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        status,
        ...(doctorNotes && { doctorNotes })
      },
      { new: true }
    ).populate('serviceId', 'title')
     .populate('patientId', 'name');

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    return appointment;
  }
}

export const doctorService = new DoctorService();
