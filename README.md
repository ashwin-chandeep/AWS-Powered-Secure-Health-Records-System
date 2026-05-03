# AWS-Powered Secure Health Records System

A full-stack, cloud-native clinic management platform built with **React 18** (frontend) and **Java Spring Boot 3** (backend), powered by **Amazon RDS MySQL** for scalable, secure cloud data persistence.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 |
| Backend | Java 17, Spring Boot 3, Spring Security, JWT |
| Database | Amazon RDS for MySQL (ap-south-1, Mumbai) |
| PDF Generation | iText |
| Build Tools | Maven, npm |

---

## Features

- 🔐 **JWT Authentication** — Stateless session management with role-based access control (Patient / Doctor)
- 👨‍⚕️ **Doctor Portal** — Daily schedule management, appointment approval/rejection, digital prescription authoring, and earnings dashboard
- 🏥 **Patient Portal** — Doctor discovery, slot-based appointment booking, prescription PDF downloads, and payment tracking
- 🛡️ **Secure Medical Records Access** — Doctors send access requests to patients; patients approve or reject via a dedicated Data Privacy dashboard
- ☁️ **AWS RDS Integration** — Production-grade MySQL database hosted on Amazon RDS in the Mumbai (`ap-south-1`) region with HikariCP connection pooling
- 📄 **Prescription PDF** — Server-side PDF generation and secure download using iText

---

## Project Structure

```
AWS-Powered-Secure-Health-Records-System/
│
├── backend/                         # Spring Boot 3 REST API
│   └── src/main/java/com/clinic/
│       ├── controller/              # REST controllers (Auth, Doctor, Appointment, Prescription, etc.)
│       ├── service/                 # Business logic layer
│       ├── entity/                  # JPA entities (User, Doctor, Prescription, Payment, etc.)
│       ├── dto/                     # Request/Response DTOs
│       ├── repository/              # Spring Data JPA repositories
│       └── security/                # JWT filter, token provider & SecurityConfig
│
└── frontend/                        # React 18 SPA
    └── src/
        ├── api/                     # Axios service modules for each backend endpoint
        ├── components/              # Reusable UI components (Button, Badge, Modal, Skeleton)
        │   ├── guards/              # AuthGuard, RoleGuard, CityGuard for route protection
        │   └── layout/              # AppLayout (Sidebar + Navbar)
        ├── pages/
        │   ├── auth/                # Login, RegisterPatient, RegisterDoctor
        │   ├── patient/             # Patient portal pages
        │   └── doctor/              # Doctor portal pages
        └── store/                   # Global state management
```

---

## Architecture

```
[React SPA :5173]
       │
       │ Axios + JWT Bearer Token
       ▼
[Spring Boot API :8080]
       │
       │ HikariCP Connection Pool
       ▼
[Amazon RDS MySQL :3306]
  (ap-south-1, Mumbai)
```

> Hibernate (`spring.jpa.hibernate.ddl-auto=update`) automatically creates/updates all required database tables on first startup.

---

## Getting Started

### Prerequisites
- Java 17+
- Apache Maven 3.6+
- Node.js 18+
- An AWS RDS MySQL instance (or local MySQL for development)

### 1. Configure the Backend

Fill in your credentials in `backend/src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://<YOUR_RDS_ENDPOINT>:3306/doctor_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=<YOUR_DB_USERNAME>
spring.datasource.password=<YOUR_DB_PASSWORD>

# JWT
jwt.secret=<YOUR_JWT_SECRET_64_CHARS>
jwt.expiration-ms=86400000
```

### 2. Run the Backend

```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
```

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

---

## API Endpoints (Key)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Patient / Doctor login |
| `POST` | `/api/auth/register/patient` | Register as patient |
| `POST` | `/api/auth/register/doctor` | Register as doctor |
| `GET`  | `/api/doctors/{city}` | List doctors by city |
| `POST` | `/api/appointments` | Book an appointment |
| `PUT`  | `/api/appointments/{id}/status` | Accept / Reject appointment |
| `POST` | `/api/prescriptions` | Create a prescription |
| `GET`  | `/api/prescriptions/{id}/pdf` | Download prescription PDF |
| `POST` | `/api/access-requests` | Request medical history access |
| `PUT`  | `/api/access-requests/{id}/approve` | Approve access request |

---

## Resume Highlights

- Engineered a **cloud-native prescription platform** with digital medicine schedule authoring and server-side PDF generation
- Integrated **Amazon RDS MySQL** for production-grade, highly available health record storage in the `ap-south-1` Mumbai region
- Implemented **bi-directional Medical Record Access APIs** with strict patient-controlled data privacy and scope-based approval
- Secured all API communications using **Spring Security + JWT** with Axios interceptors handling automatic session expiry (401 redirects)
- Built a responsive, **role-based UI** (Patient and Doctor portals) with React 18 featuring skeleton loaders and animated transitions
