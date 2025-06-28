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


  // async updateDoctor(data: DoctorUpdateData): Promise<DoctorResponse> {
  //   const doctor = await Doctor.findByIdAndUpdate(
  //     data.id,
  //     { $set: data },
  //     { new: true, select: '-password' }
  //   );

  //   if (!doctor) {
  //     throw new NotFoundError('Doctor not found');
  //   }

  //   return {
  //     id: (doctor._id as any).toString(),
  //     name: doctor.name,
  //     email: doctor.email,
  //     phone: doctor.phone,
  //     specialization: doctor.specialization,
  //     hospitalName: doctor.hospitalName,
  //     hospitalFloor: doctor.hospitalFloor,
  //     role: doctor.role
  //   };
  // }

  // async deleteDoctor(id: string): Promise<{ message: string }> {
  //   const doctor = await Doctor.findByIdAndDelete(id);
  //   if (!doctor) {
  //     throw new NotFoundError('Doctor not found');
  //   }

  //   return { message: 'Doctor deleted successfully' };
  // }

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
    // First, get the current appointment to check its current status
    const currentAppointment = await Appointment.findById(appointmentId);
    if (!currentAppointment) {
      throw new NotFoundError('Appointment not found');
    }

    const previousStatus = currentAppointment.status;
    const newStatus = status;

    // Validate status transition
    if (previousStatus === 'completed' && newStatus !== 'completed') {
      throw new ValidationError('Cannot change status of a completed appointment');
    }

    if (previousStatus === 'cancelled' && newStatus !== 'cancelled') {
      throw new ValidationError('Cannot change status of a cancelled appointment');
    }

    // Handle time slot availability based on status changes
    await this.handleTimeSlotAvailability(currentAppointment, previousStatus, newStatus);

    // Update the appointment status
    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { 
        status: newStatus,
        doctorNotes: doctorNotes || currentAppointment.doctorNotes
      },
      { new: true }
    ).populate('serviceId', 'title')
     .populate('patientId', 'name');

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    return appointment;
  }

  /**
   * Handle time slot availability based on appointment status changes
   */
  private async handleTimeSlotAvailability(
    appointment: IAppointment, 
    previousStatus: AppointmentStatus, 
    newStatus: AppointmentStatus
  ): Promise<void> {
    const { doctorId, serviceId, scheduledDate, scheduledTime } = appointment;

    // If status is changing from pending to accepted, check if time slot is still available
    if (previousStatus === 'pending' && newStatus === 'accepted') {
      const conflictingAppointment = await Appointment.findOne({
        doctorId,
        scheduledDate,
        scheduledTime,
        status: { $in: ['accepted', 'pending'] },
        _id: { $ne: appointment._id }
      });

      if (conflictingAppointment) {
        throw new ValidationError('This time slot is no longer available. It may have been booked by another patient.');
      }
    }

    // If status is changing from accepted to cancelled, the time slot becomes available again
    // If status is changing from pending to cancelled, the time slot becomes available again
    if ((previousStatus === 'accepted' || previousStatus === 'pending') && newStatus === 'cancelled') {
      // Time slot becomes available again - no action needed as we don't block other bookings
      // The booking validation in bookAppointment will handle this
    }

    // If status is changing from pending to accepted, the time slot becomes unavailable
    if (previousStatus === 'pending' && newStatus === 'accepted') {
      // Time slot becomes unavailable - this is handled by the booking validation
      // which checks for existing accepted/pending appointments
    }

    // If status is changing from cancelled to accepted, check availability again
    if (previousStatus === 'cancelled' && newStatus === 'accepted') {
      const conflictingAppointment = await Appointment.findOne({
        doctorId,
        scheduledDate,
        scheduledTime,
        status: { $in: ['accepted', 'pending'] },
        _id: { $ne: appointment._id }
      });

      if (conflictingAppointment) {
        throw new ValidationError('This time slot is no longer available. It may have been booked by another patient.');
      }
    }
  }

  /**
   * Get available time slots for a specific date and doctor
   */
  async getAvailableTimeSlots(doctorId: string, serviceId: string, date: Date): Promise<string[]> {
    // Get the doctor's availability for this service
    const availability = await Availability.findOne({ doctorId, serviceId });
    if (!availability) {
      throw new NotFoundError('No availability set for this doctor and service');
    }

    // Get the day of the week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = date.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    // Find the day's schedule
    const daySchedule = availability.weeklySchedule.find(schedule => schedule.day === dayName);
    if (!daySchedule || !daySchedule.isAvailable) {
      return []; // No availability for this day
    }

    // Get all booked time slots for this date
    const bookedAppointments = await Appointment.find({
      doctorId,
      scheduledDate: date,
      status: { $in: ['pending', 'accepted'] }
    });

    const bookedTimeSlots = bookedAppointments.map(appointment => appointment.scheduledTime);

    // Filter out booked time slots from available time slots
    const availableTimeSlots = daySchedule.timeSlots
      .map(slot => slot.startTime)
      .filter(timeSlot => !bookedTimeSlots.includes(timeSlot));

    return availableTimeSlots;
  }

  // Get appointment by ID
  async getAppointmentById(appointmentId: string): Promise<IAppointment> {
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctorId', 'name specialization hospitalName')
      .populate('patientId', 'name email phone')
      .populate('serviceId', 'name description price');

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  }
}

export const doctorService = new DoctorService();
