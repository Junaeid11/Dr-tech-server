export interface DoctorRegistrationData {
    name: string;
    email: string;
    phone: string;
    password: string;
    specialization: string;
    hospitalName: string;
    hospitalFloor: string;
  }
  
  export interface PatientRegistrationData {
    name: string;
    email: string;
    phone: string;
    password: string;
    age: number;
    gender: string;
  }
  
  export interface LoginData {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    role: string;
    id: string;
  }
  