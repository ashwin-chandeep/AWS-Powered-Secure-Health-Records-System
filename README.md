# AWS-Powered Secure Health Records System

A full-stack, cloud-native clinic management platform built with **React 18** (frontend) and **Spring Boot 3** (backend), powered by **AWS RDS MySQL** for scalable cloud data persistence.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 |
| Backend | Java 17, Spring Boot 3, Spring Security, JWT |
| Database | AWS RDS MySQL (ap-south-1, Mumbai) |
| PDF Generation | iText |
| Build Tools | Maven, npm |

## Features

- 🔐 **JWT Authentication** — Stateless session management with role-based access (Patient / Doctor)
- 👨‍⚕️ **Doctor Portal** — Daily schedule, appointment management, digital prescription creation, earnings tracking
- 🏥 **Patient Portal** — Doctor search, appointment booking, prescription PDF downloads, payment tracking
- 🛡️ **Secure Medical Records Access** — Doctors request permission to view full patient history; patients approve/reject via a dedicated privacy dashboard
- ☁️ **AWS RDS** — Production database hosted on Amazon RDS MySQL in the Mumbai region
- 📄 **Prescription PDF** — Server-side PDF generation and download using iText

## Project Structure

```
.
├── backend/              # Spring Boot REST API
│   ├── src/main/java/com/clinic/
│   │   ├── controller/   # REST controllers
│   │   ├── service/      # Business logic
│   │   ├── entity/       # JPA entities
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── repository/   # Spring Data JPA repos
│   │   └── security/     # JWT & Spring Security config
│   └── src/main/resources/
│       └── application.properties  # Config (use your own credentials)
│
└── frontend/             # React + Vite SPA
    ├── src/
    │   ├── api/          # Axios services for each endpoint
    │   ├── components/   # Reusable UI components & Guards
    │   ├── pages/        # Patient & Doctor portal pages
    │   └── store/        # Zustand state management
    └── tailwind.config.js
```

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+
- A MySQL database (local or AWS RDS)

### 1. Configure the Backend

Copy the template and fill in your credentials:

```properties
# backend/src/main/resources/application.properties

spring.datasource.url=jdbc:mysql://<YOUR_AWS_RDS_ENDPOINT>:3306/doctor_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=<YOUR_DB_USERNAME>
spring.datasource.password=<YOUR_DB_PASSWORD>

jwt.secret=<YOUR_JWT_SECRET_KEY_64_CHARS>
jwt.expiration-ms=86400000
```

### 2. Run the Backend

```bash
cd backend
mvn spring-boot:run
# API will be available at http://localhost:8080
```

### 3. Run the Frontend

```bash
cd frontend
npm install
npm run dev
# App will be available at http://localhost:5173
```

## Architecture

```
[React SPA :5173] ──(Axios + JWT)──▶ [Spring Boot :8080] ──(HikariCP)──▶ [AWS RDS MySQL]
```

Hibernate (`ddl-auto=update`) auto-generates the full database schema on first startup.

## Resume Highlights

- Engineered a **cloud-native prescription platform** integrating digitally authored medicine schedules and PDF generation
- Integrated **AWS RDS** for cloud-persisted, highly available health records in the `ap-south-1` Mumbai region
- Implemented **bi-directional Medical Record Access APIs** with strict patient-controlled data privacy
- Secured all communications with **Spring Security + JWT** and Axios interceptors with automatic 401 handling
