# Spring Boot Backend for Doctor Appointment & Digital Clinic

Build a production-grade Spring Boot backend to replace the Angular frontend's localStorage mock services with real REST APIs backed by MySQL.

## Key Design Insight

> [!IMPORTANT]
> The Angular frontend currently has **zero HTTP calls** — all data operations use `localStorage` via [StorageService](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/storage.service.ts#4-29). The Angular services ([auth.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts), [appointment.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts), etc.) must be refactored to use `HttpClient` instead. **No components or templates will change** — only the service layer internals.

---

## Proposed Changes

### 1. Spring Boot Project Initialization

#### [NEW] [backend/](file:///c:/Users/Admin/Desktop/Anti%20Doctor/backend/)

Create a Spring Boot 3.4 Maven project with Maven Wrapper at `c:\Users\Admin\Desktop\Anti Doctor\backend\`.

**Dependencies:**
- `spring-boot-starter-web`
- `spring-boot-starter-data-jpa`
- `spring-boot-starter-security`
- `spring-boot-starter-validation`
- `mysql-connector-j`
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` (io.jsonwebtoken 0.12.x)
- `lombok` (optional, compile-only)

**`application.properties`:**
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/clinic_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true
jwt.secret=<64-char-hex-key>
jwt.expiration-ms=86400000
```

---

### 2. Database Schema (MySQL)

#### [NEW] [schema.sql](file:///c:/Users/Admin/Desktop/Anti%20Doctor/backend/src/main/resources/schema.sql)

10 tables designed from the Angular models:

| Table | Source Model | Purpose |
|---|---|---|
| `users` | [AppUser](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#12-33) | Authentication (email, phone, password_hash, role) |
| `doctors` | [DoctorDirectoryItem](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts#10-23) + [AppUser](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#12-33) doctor fields | Doctor profile (specialization, fee, lat/lng, hospital, working hours) |
| `cities` | [City](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/city.service.ts#4-5) type | Chennai, Madurai |
| `medical_services` | [MedicalService](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts#4-9) | Services per city |
| `appointments` | [Appointment](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#7-23) | Bookings with status lifecycle |
| `prescriptions` | [Prescription](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#17-42) | Prescription header |
| `prescription_medicines` | [PrescriptionMedicine](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#7-16) | Medicine rows per prescription |
| `access_requests` | [AccessRequest](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/access-request.service.ts#7-18) | Medical history access control |
| `notifications` | [AppNotification](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/notification.service.ts#14-24) | In-app notifications |
| `payments` | Derived from [Appointment](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#7-23) | Payment tracking (virtual, not separate entity for phase 1 — payments are derived from appointment status as the frontend does) |

> [!NOTE]
> The frontend derives payment status from `Appointment.status` (COMPLETED→PAID, ACCEPTED→DUE, etc.) and amounts from the doctor's fee. So we don't need a separate `payments` table for local-only phase. Payments are computed server-side.

---

### 3. Entity Layer

#### [NEW] Java entity classes in `backend/src/main/java/com/clinic/entity/`

| File | Maps to |
|---|---|
| `User.java` | `users` table — id, email, phone, passwordHash, role enum (PATIENT/DOCTOR) |
| `Doctor.java` | `doctors` table — userId FK, name, specialization, fee, hospitalName, clinicAddress, lat, lng, rating, city, workingHoursStart/End, slotIntervalMinutes |
| `MedicalService.java` | `medical_services` table — name, city |
| `Appointment.java` | `appointments` table — patientId, doctorId, serviceId, city, slotIso, endIso, status enum |
| `Prescription.java` | `prescriptions` table — appointmentId FK, clinicName, doctorName, reg#, patient info, diagnosis, advice |
| `PrescriptionMedicine.java` | `prescription_medicines` table — prescriptionId FK, tabletName, breakfast/lunch/dinner booleans, foodInstruction enum, durationDays |
| `AccessRequest.java` | `access_requests` table — doctorId, patientId, status enum, approvedScope enum |
| `Notification.java` | `notifications` table — userId, type enum, title, message, read boolean, meta JSON |

---

### 4. Repository Layer

#### [NEW] JPA repositories in `backend/src/main/java/com/clinic/repository/`

One Spring Data JPA `@Repository` interface per entity with custom query methods:

- `UserRepository` — `findByEmail()`, `findByPhone()`, `findByEmailOrPhone()`
- `DoctorRepository` — `findByCity()`, `findByUserId()`
- `MedicalServiceRepository` — `findByCity()`
- `AppointmentRepository` — `findByPatientId()`, `findByDoctorId()`, `findByDoctorIdAndStatus()`
- `PrescriptionRepository` — `findByPatientId()`, `findByDoctorId()`, `findByAppointmentId()`
- `PrescriptionMedicineRepository` — `findByPrescriptionId()`
- `AccessRequestRepository` — `findByDoctorId()`, `findByPatientId()`, `findByDoctorIdAndPatientIdAndStatus()`
- `NotificationRepository` — `findByUserId()`, `countByUserIdAndReadFalse()`

---

### 5. DTO Layer

#### [NEW] DTOs in `backend/src/main/java/com/clinic/dto/`

**Auth:**
- `LoginRequest` (identifier, password) → `LoginResponse` (token, user)
- `RegisterPatientRequest` (name, email, phone, password) → `AuthResponse`
- `RegisterDoctorRequest` (all doctor fields) → `AuthResponse`

**Appointments:**
- `CreateAppointmentRequest` (city, doctorId, serviceId, serviceName, slotIso, endIso)
- `AppointmentResponse` (all Appointment fields + computed names)
- `UpdateStatusRequest` (status)

**Prescriptions:**
- `CreatePrescriptionRequest` (all Prescription fields + medicines array)
- `PrescriptionResponse` (full prescription + medicines)

**Access Requests:**
- `CreateAccessRequestRequest` (patientId)
- `ApproveAccessRequest` (scope: THIS_DOCTOR / ALL_DOCTORS)
- `AccessRequestResponse`

**Notifications:**
- `NotificationResponse`

**Doctors:**
- `DoctorResponse` (matches [DoctorDirectoryItem](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts#10-23) shape)
- `UserResponse` (matches [AppUser](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#12-33) shape)

---

### 6. Security Layer (JWT)

#### [NEW] Security classes in `backend/src/main/java/com/clinic/security/`

| File | Purpose |
|---|---|
| `JwtTokenProvider.java` | Generate/validate JWT tokens using JJWT library |
| `JwtAuthenticationFilter.java` | `OncePerRequestFilter` — extracts JWT from `Authorization: Bearer <token>`, validates, sets `SecurityContext` |
| `SecurityConfig.java` | `@Configuration` — permit `/api/auth/**` and `/api/doctors/**` and `/api/services/**`; require auth for everything else |
| `UserDetailsServiceImpl.java` | Load user by email/phone for Spring Security |
| `CustomUserDetails.java` | Wraps [User](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#12-33) entity with role |

**Key rules from the frontend guards:**
- [AuthGuard](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/guards/auth.guard.ts#7-29) → checks `auth_token` in localStorage → backend: JWT validation
- [RoleGuard](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/guards/role.guard.ts#5-28) → checks `user.role === required` → backend: `@PreAuthorize("hasRole('PATIENT')")` or `hasRole('DOCTOR')`
- [CityGuard](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/guards/city.guard.ts#6-32) → client-side only (city selection is a frontend concern stored in localStorage)

---

### 7. Service Layer

#### [NEW] Service classes in `backend/src/main/java/com/clinic/service/`

| File | Key methods | Maps to Angular service |
|---|---|---|
| `AuthService.java` | [login()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#143-158), [registerPatient()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#168-204), [registerDoctor()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#205-269), [getCurrentUser()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#133-142) | [auth.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts) |
| `DoctorService.java` | `getDoctorsByCity()`, `getSpecializations()`, `getDoctorById()` | [mock-data.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts) (doctors) |
| `MedicalServiceService.java` | `getServicesByCity()` | [mock-data.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts) (services) |
| `AppointmentService.java` | [createRequest()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#48-72), [listForPatient()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#54-57), [listForDoctor()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#58-61), [listDoctorRequests()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#44-47), [updateStatus()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#73-83), [isSlotLocked()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#84-88), `autoComplete()` | [appointment.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts) |
| `PrescriptionService.java` | [create()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#70-84), [upsertForAppointment()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#85-111), [listForPatient()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#54-57), [listForDoctor()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#58-61), [getById()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#62-65), [getByAppointmentId()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#66-69) | [prescription.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts) |
| `AccessRequestService.java` | [createRequest()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#48-72), [approve()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/features/patient/pages/medical-history/patient-medical-history.ts#103-116), [reject()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/access-request.service.ts#65-68), [listForDoctor()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#58-61), [listForPatient()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#54-57), [hasAccess()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/access-request.service.ts#69-89) | [access-request.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/access-request.service.ts) |
| `NotificationService.java` | [create()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#70-84), [listForUser()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/notification.service.ts#33-36), [unreadCount()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/notification.service.ts#37-40), [markAllRead()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/notification.service.ts#55-69) | [notification.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/notification.service.ts) |

---

### 8. Controller Layer (REST API)

#### [NEW] Controllers in `backend/src/main/java/com/clinic/controller/`

**`AuthController.java`** — `/api/auth`
| Method | Endpoint | Angular caller |
|---|---|---|
| POST | `/api/auth/login` | [login()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#143-158) |
| POST | `/api/auth/register/patient` | [registerPatient()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#168-204) |
| POST | `/api/auth/register/doctor` | [registerDoctor()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#205-269) |
| GET | `/api/auth/me` | [getCurrentUser()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#133-142) |

**`DoctorController.java`** — `/api/doctors`
| Method | Endpoint | Angular caller |
|---|---|---|
| GET | `/api/doctors?city={city}` | [getDoctors(city)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts#322-325) |
| GET | `/api/doctors/{id}` | Book appointment page |
| GET | `/api/doctors/specializations?city={city}` | [getAllSpecializations(city)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts#326-330) |

**`MedicalServiceController.java`** — `/api/services`
| Method | Endpoint | Angular caller |
|---|---|---|
| GET | `/api/services?city={city}` | [getServices(city)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts#318-321) |

**`AppointmentController.java`** — `/api/appointments`
| Method | Endpoint | Angular caller |
|---|---|---|
| POST | `/api/appointments` | [createRequest()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#48-72) |
| GET | `/api/appointments/patient` | [listForPatient(patientId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#54-57) |
| GET | `/api/appointments/doctor` | [listForDoctor(doctorId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#58-61) |
| GET | `/api/appointments/doctor/requests` | [listDoctorRequests(doctorId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#44-47) |
| PUT | `/api/appointments/{id}/status` | [updateStatus()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#73-83) |
| GET | `/api/appointments/slot-locked?doctorId=&slotIso=` | [isSlotLocked()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#84-88) |

**`PrescriptionController.java`** — `/api/prescriptions`
| Method | Endpoint | Angular caller |
|---|---|---|
| POST | `/api/prescriptions` | [upsertForAppointment()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#85-111) |
| GET | `/api/prescriptions/patient` | [listForPatient(patientId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#54-57) |
| GET | `/api/prescriptions/doctor` | [listForDoctor(doctorId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#58-61) |
| GET | `/api/prescriptions/{id}` | [getById()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#62-65) |
| GET | `/api/prescriptions/appointment/{appointmentId}` | [getByAppointmentId()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#66-69) |

**`AccessRequestController.java`** — `/api/access-requests`
| Method | Endpoint | Angular caller |
|---|---|---|
| POST | `/api/access-requests` | [createRequest()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts#48-72) |
| GET | `/api/access-requests/doctor` | [listForDoctor(doctorId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#58-61) |
| GET | `/api/access-requests/patient` | [listForPatient(patientId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#54-57) |
| PUT | `/api/access-requests/{id}/approve` | [approve()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/features/patient/pages/medical-history/patient-medical-history.ts#103-116) |
| PUT | `/api/access-requests/{id}/reject` | [reject()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/access-request.service.ts#65-68) |
| GET | `/api/access-requests/has-access?doctorId=&patientId=` | [hasAccess()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/access-request.service.ts#69-89) |

**`NotificationController.java`** — `/api/notifications`
| Method | Endpoint | Angular caller |
|---|---|---|
| GET | `/api/notifications` | [listForUser(userId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/notification.service.ts#33-36) |
| GET | `/api/notifications/unread-count` | [unreadCount(userId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/notification.service.ts#37-40) |
| POST | `/api/notifications` | [create()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts#70-84) |
| PUT | `/api/notifications/mark-read` | [markAllRead(userId)](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/notification.service.ts#55-69) |

---

### 9. Angular Services Refactoring

> [!IMPORTANT]
> Minimal changes: only the service layer internals change (localStorage → HttpClient). **No components, templates, guards, or routing changes.**

#### [MODIFY] [auth.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts)
- Replace mock account logic with `HttpClient` calls to `/api/auth/*`
- Store JWT token in `localStorage` (keep [StorageService](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/storage.service.ts#4-29) for token/user caching)
- [login()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#143-158) → POST `/api/auth/login` → store token + user
- [registerPatient()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#168-204) → POST `/api/auth/register/patient`
- [registerDoctor()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#205-269) → POST `/api/auth/register/doctor`
- [getCurrentUser()](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts#133-142) → cache in localStorage, refresh from `/api/auth/me` on token change

#### [MODIFY] [appointment.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/appointment.service.ts)
- All methods become HTTP calls returning Observables (converted to sync via `lastValueFrom` or made async)

#### [MODIFY] [prescription.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/prescription.service.ts)
- All methods → HTTP calls

#### [MODIFY] [access-request.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/access-request.service.ts)
- All methods → HTTP calls

#### [MODIFY] [notification.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/notification.service.ts)
- All methods → HTTP calls

#### [MODIFY] [mock-data.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts)
- Replace hardcoded arrays with HTTP calls to `/api/doctors` and `/api/services`

#### [NEW] [http-interceptor.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/interceptors/auth.interceptor.ts)
- Attach `Authorization: Bearer <token>` header to all `/api/` requests

#### [MODIFY] [app.config.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/app.config.ts)
- Add `provideHttpClient(withInterceptors([authInterceptor]))` 

---

### 10. CORS Configuration

#### [NEW] [WebConfig.java](file:///c:/Users/Admin/Desktop/Anti%20Doctor/backend/src/main/java/com/clinic/config/WebConfig.java)
- Allow `http://localhost:4200` with all methods and `Authorization` header

---

### 11. Data Seeding

#### [NEW] [DataSeeder.java](file:///c:/Users/Admin/Desktop/Anti%20Doctor/backend/src/main/java/com/clinic/config/DataSeeder.java)
- `@Component` implementing `CommandLineRunner`
- Seeds the same 4 patients, 20 doctors, 20 medical services, demo appointments, prescriptions, notifications, and access requests that are currently hardcoded in [auth.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/auth.service.ts) and [mock-data.service.ts](file:///c:/Users/Admin/Desktop/Anti%20Doctor/clinic-management-system/src/app/core/services/mock-data.service.ts)

---

## Verification Plan

### Automated Tests

1. **Build verification** — `./mvnw clean package -DskipTests` must compile without errors
2. **Spring Boot startup** — `./mvnw spring-boot:run` must start and connect to MySQL
3. **API smoke test via curl:**
   ```
   # Register a patient
   curl -X POST http://localhost:8080/api/auth/register/patient -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com","phone":"9999999999","password":"Test@123"}'
   
   # Login
   curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"identifier":"test@test.com","password":"Test@123"}'
   
   # Get doctors (with token)
   curl http://localhost:8080/api/doctors?city=Chennai -H "Authorization: Bearer <token>"
   ```

### Manual Browser Verification

1. Start Spring Boot backend: `cd backend && ./mvnw spring-boot:run`
2. Start Angular frontend: `cd clinic-management-system && npm start`
3. Open `http://localhost:4200` in browser
4. **Login** with demo credentials → verify token received and stored
5. **Select city** → verify doctors load from backend
6. **Search doctors** → verify filtering works
7. **Book appointment** → verify appointment created in MySQL
8. **Doctor login** → view requests → accept appointment
9. **Create prescription** → verify saved to database
10. **View prescription** → verify PDF-ready display
11. **Notifications** → verify notification delivery both ways
12. **Medical history** → verify access request flow

> [!TIP]
> I will use the browser tool to automate testing key flows (login, book appointment, create prescription) after the backend is running.
