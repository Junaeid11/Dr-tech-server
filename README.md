# 🏥 Doctor-Patient Appointment System

A comprehensive REST API for managing doctor-patient appointments with authentication, role-based access control, and real-time appointment status tracking.

## 🌐 Live Application

**🔗 Live Demo**: [dr-tech.vercel.app](https://dr-tech.vercel.app)

---

## 👨‍💻 Author

**Junaeid Ahmed Tanim**  
📧 Email: [junaeidahmed979@gmail.com](mailto:junaeidahmed979@gmail.com)  
🌐 Portfolio: [noobwork.me](https://noobwork.me)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Testing with Postman](#-testing-with-postman)
- [Appointment Flow](#-appointment-flow)
- [Contributing](#-contributing)

## ✨ Features

- **🔐 JWT Authentication** - Secure user authentication with role-based access
- **👨‍⚕️ Doctor Management** - Doctor registration, profile management, and service creation
- **👤 Patient Management** - Patient registration and profile management
- **📅 Appointment Booking** - Real-time appointment scheduling with availability checking
- **⏰ Time Slot Management** - Dynamic time slot availability and conflict prevention
- **📊 Appointment Status Tracking** - Pending, Accepted, Cancelled, Completed statuses
- **🔄 Status Workflow** - Complete appointment lifecycle management
- **🛡️ Input Validation** - Comprehensive request validation and error handling
- **📝 Role-based Access** - Separate permissions for doctors and patients

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Custom validation middleware
- **Error Handling**: Custom error classes and middleware

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-task-dr-tech
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install TypeScript globally** (if not already installed)
   ```bash
   npm install -g typescript
   ```

## ⚙️ Environment Setup

1. **Create a `.env` file** in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   MONGO_URI=your_mongodb_uri_here

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here

   # Optional: MongoDB Atlas (if using cloud database)
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/doctor-patient-db
   ```

2. **Update the JWT_SECRET** with a strong, unique secret key

## 🗄️ Database Setup

### Local MongoDB Setup

1. **Install MongoDB** on your system
2. **Start MongoDB service**
   ```bash
   # Windows
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```

### MongoDB Atlas Setup (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGO_URI` in your `.env` file

## ▶️ Running the Application

### Development Mode

```bash
# Start the development server
npm run dev

# Or using TypeScript directly
npx ts-node src/server.ts
```

### Production Mode

```bash
# Build the application
npm run build

# Start the production server
npm start
```

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start           # Start production server with ts-node
npm test            # Run tests (currently not configured)
```

### Postman Collection

The project includes a complete Postman collection file: `Dr tech.postman_collection.json`

This collection contains all the API endpoints with:
- Pre-configured requests for all endpoints
- Example request bodies
- Environment variables setup
- Authentication headers
- Response examples

To use the collection:
1. Import `Dr tech.postman_collection.json` into Postman
2. Set up the environment variables
3. Start testing the API endpoints

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### 1. Register Doctor
```http
POST /auth/register-doctor
Content-Type: application/json

{
  "name": "Dr. John Smith",
  "email": "john.smith@hospital.com",
  "phone": "+1234567890",
  "password": "password123",
  "specialization": "Cardiology",
  "hospitalName": "City General Hospital",
  "hospitalFloor": "3rd Floor"
}
```

#### 2. Register Patient
```http
POST /auth/register-patient
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice.johnson@email.com",
  "phone": "+1234567890",
  "password": "password123",
  "age": 28,
  "gender": "female"
}
```

#### 3. Login (Doctor or Patient)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "alice.johnson@email.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "User logged in successfully!",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Patient Endpoints

#### 1. Book Appointment
```http
POST /patients/appointments
Authorization: YOUR_PATIENT_TOKEN
Content-Type: application/json

{
  "doctorId": "507f1f77bcf86cd799439011",
  "serviceId": "507f1f77bcf86cd799439012",
  "scheduledDate": "2024-01-20",
  "scheduledTime": "10:00"
}
```

#### 2. Get Patient Appointments
```http
GET /patients/appointments?status=pending
Authorization: YOUR_PATIENT_TOKEN
```

#### 3. Get All Doctors
```http
GET /patients/doctor
Authorization: YOUR_PATIENT_TOKEN
```

#### 4. Get Doctor by ID
```http
GET /patients/doctor/507f1f77bcf86cd799439011
Authorization: YOUR_PATIENT_TOKEN
```

### Doctor Endpoints

#### 1. Get Doctor Appointments
```http
GET /doctors/507f1f77bcf86cd799439011/appointments?status=pending
Authorization: YOUR_DOCTOR_TOKEN
```

#### 2. Update Appointment Status
```http
PATCH /doctors/appointments/507f1f77bcf86cd799439013/status
Authorization: YOUR_DOCTOR_TOKEN
Content-Type: application/json

{
  "status": "accepted",
  "doctorNotes": "Appointment confirmed. Please arrive 10 minutes early."
}
```

#### 3. Add Service
```http
POST /doctors/507f1f77bcf86cd799439011/services
Authorization: YOUR_DOCTOR_TOKEN
Content-Type: application/json

{
  "title": "Cardiac Consultation",
  "description": "Comprehensive heart health checkup",
  "price": 150,
  "duration": 60
}
```

#### 4. Set Availability
```http
POST /doctors/507f1f77bcf86cd799439011/availability
Authorization: YOUR_DOCTOR_TOKEN
Content-Type: application/json

{
  "serviceId": "507f1f77bcf86cd799439012",
  "weeklySchedule": [
    {
      "day": "monday",
      "timeSlots": [
        {
          "startTime": "09:00",
          "endTime": "10:00"
        },
        {
          "startTime": "10:00",
          "endTime": "11:00"
        }
      ],
      "isAvailable": true
    }
  ]
}
```

#### 5. Get Available Time Slots
```http
GET /doctors/507f1f77bcf86cd799439011/507f1f77bcf86cd799439012/available-slots/2024-01-20
Authorization: YOUR_DOCTOR_TOKEN
```

## 🔐 Authentication

### JWT Token Usage

All protected endpoints require a valid JWT token in the Authorization header:

```http
Authorization:  YOUR_JWT_TOKEN
```

### Role-based Access

- **Patient Role**: Can book appointments, view their appointments, view doctors
- **Doctor Role**: Can manage appointments, services, availability, view their appointments

### Token Expiration

- **Access Token**: 24 hours
- **Refresh Token**: 7 days

## 🧪 Testing with Postman

### 1. Environment Setup

Create a new environment in Postman with these variables:

```json
{
  "baseUrl": "http://localhost:5000",
  "patientToken": "",
  "doctorToken": "",
  "patientId": "",
  "doctorId": "",
  "serviceId": "",
  "appointmentId": ""
}
```

### 2. Test Flow

1. **Register a doctor and patient**
2. **Login to get access tokens**
3. **Set tokens in environment variables**
4. **Test appointment booking flow**

## 🔄 Appointment Flow

### Complete Workflow

1. **Patient Registration** → Patient creates account
2. **Doctor Registration** → Doctor creates account
3. **Service Creation** → Doctor adds services
4. **Availability Setup** → Doctor sets weekly schedule
5. **Appointment Booking** → Patient books appointment (status: pending)
6. **Doctor Review** → Doctor sees pending appointments
7. **Status Update** → Doctor accepts/cancels appointment
8. **Patient Notification** → Patient sees updated status

### Status Transitions

```
Pending → Accepted (Time slot becomes unavailable)
Pending → Cancelled (Time slot becomes available)
Accepted → Completed (Appointment finished)
Accepted → Cancelled (Time slot becomes available)
```

## 📁 Project Structure

```
job-task-dr-tech/
├── README.md                                    # Project documentation
├── package.json                                 # Node.js dependencies and scripts
├── package-lock.json                           # Locked dependency versions
├── tsconfig.json                               # TypeScript configuration
├── .gitignore                                  # Git ignore rules
├── Dr tech.postman_collection.json             # Postman collection for testing
└── src/                                        # Source code directory
    ├── app.ts                                  # Express app configuration
    ├── server.ts                               # Server entry point
    ├── middleware/                             # Middleware functions
    │   ├── auth.ts                            # JWT authentication middleware
    │   ├── errorHandler.ts                    # Global error handling
    │   └── validation.ts                      # Input validation middleware
    ├── modules/                               # Feature modules
    │   ├── auth/                              # Authentication module
    │   │   ├── auth.controller.ts             # Auth controller
    │   │   ├── auth.service.ts                # Auth business logic
    │   │   ├── auth.interface.ts              # Auth TypeScript interfaces
    │   │   └── auth.routes.ts                 # Auth routes
    │   ├── doctor/                            # Doctor management module
    │   │   ├── doctor.controller.ts           # Doctor controller
    │   │   ├── doctor.service.ts              # Doctor business logic
    │   │   ├── doctor.interface.ts            # Doctor TypeScript interfaces
    │   │   ├── doctor.model.ts                # Doctor MongoDB model
    │   │   └── doctor.routes.ts               # Doctor routes
    │   └── Patient/                           # Patient management module
    │       ├── patient.controller.ts          # Patient controller
    │       ├── patient.service.ts             # Patient business logic
    │       ├── patient.interface.ts           # Patient TypeScript interfaces
    │       ├── patient.model.ts               # Patient MongoDB model
    │       └── patient.routes.ts              # Patient routes
    ├── utils/                                 # Utility functions
    │   ├── catchAsync.ts                      # Async error handler wrapper
    │   ├── errors.ts                          # Custom error classes
    │   ├── hash.ts                            # Password hashing utilities
    │   ├── jwt.ts                             # JWT token utilities
    │   └── sendResponse.ts                    # Standardized response formatter
    └── interface/                             # Global TypeScript interfaces
        └── index.ts                           # Shared interfaces
```

### Key Files Description

- **`app.ts`**: Main Express application setup with middleware and route configuration
- **`server.ts`**: Server startup file that connects to MongoDB and starts the server
- **`middleware/auth.ts`**: JWT token verification and user authentication
- **`middleware/validation.ts`**: Request body validation for registration and login
- **`middleware/errorHandler.ts`**: Global error handling middleware
- **`modules/*/controller.ts`**: HTTP request handlers and response formatting
- **`modules/*/service.ts`**: Business logic and database operations
- **`modules/*/model.ts`**: MongoDB schema definitions and models
- **`modules/*/routes.ts`**: Express route definitions
- **`utils/jwt.ts`**: JWT token generation and verification
- **`utils/hash.ts`**: Password hashing and comparison
- **`utils/errors.ts`**: Custom error classes for different scenarios

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🔄 Updates

- **v1.0.0**: Initial release with basic appointment booking
- **v1.1.0**: Added authentication and role-based access
- **v1.2.0**: Enhanced appointment status management
- **v1.3.0**: Added time slot availability checking

---

**Happy Coding! 🚀**