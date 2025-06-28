export interface ServiceData {
  title: string;
  description: string;
  price: number;
  duration: number; // in minutes
  doctorId: string;
}

export interface ServiceUpdateData extends Partial<ServiceData> {
  id: string;
}

export interface ServiceResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  doctorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceWithAvailability extends ServiceResponse {
  availability: AvailabilityResponse[];
} 