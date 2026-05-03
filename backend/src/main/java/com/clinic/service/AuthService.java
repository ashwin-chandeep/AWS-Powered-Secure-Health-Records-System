package com.clinic.service;

import com.clinic.dto.*;
import com.clinic.entity.*;
import com.clinic.repository.*;
import com.clinic.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;
    private final MedicalServiceRepository svcRepo;
    private final DoctorMedicalServiceRepository dmsRepo;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwt;

    public AuthService(UserRepository userRepo, DoctorRepository doctorRepo,
                       MedicalServiceRepository svcRepo, DoctorMedicalServiceRepository dmsRepo,
                       PasswordEncoder encoder, JwtTokenProvider jwt) {
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
        this.svcRepo = svcRepo;
        this.dmsRepo = dmsRepo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public AuthResponse login(LoginRequest req) {
        String id = req.getIdentifier().trim().toLowerCase();
        User user = userRepo.findByEmail(id)
                .or(() -> userRepo.findByPhone(req.getIdentifier().trim()))
                .orElse(null);

        if (user == null || !encoder.matches(req.getPassword(), user.getPasswordHash())) {
            return AuthResponse.builder().ok(false).message("Invalid credentials").build();
        }

        String token = jwt.generateToken(user.getId(), user.getRole().name());
        return AuthResponse.builder()
                .ok(true)
                .token(token)
                .user(buildUserResponse(user))
                .build();
    }

    public AuthResponse registerPatient(RegisterPatientRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        String phone = req.getPhone().trim();

        if (userRepo.existsByEmailOrPhone(email, phone)) {
            return AuthResponse.builder().ok(false)
                    .message("User already exists with this email/phone.").build();
        }

        User user = User.builder()
                .email(email)
                .phone(phone)
                .name(req.getName().trim())
                .passwordHash(encoder.encode(req.getPassword()))
                .role(UserRole.PATIENT)
                .build();
        user = userRepo.save(user);

        String token = jwt.generateToken(user.getId(), user.getRole().name());
        return AuthResponse.builder()
                .ok(true)
                .token(token)
                .user(buildUserResponse(user))
                .build();
    }

    @Transactional
    public AuthResponse registerDoctor(RegisterDoctorRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        String phone = req.getPhone().trim();

        if (userRepo.existsByEmailOrPhone(email, phone)) {
            return AuthResponse.builder().ok(false)
                    .message("User already exists with this email/phone.").build();
        }

        User user = User.builder()
                .email(email)
                .phone(phone)
                .name(req.getName().trim())
                .passwordHash(encoder.encode(req.getPassword()))
                .role(UserRole.DOCTOR)
                .build();
        user = userRepo.save(user);

        // Auto-derive city based on latitude
        String city = (req.getLat() != null && req.getLat() > 11.5) ? "Chennai" : "Madurai";

        Doctor doctor = Doctor.builder()
                .user(user)
                .name(req.getName().trim())
                .specialization(req.getSpecialization().trim())
                .fee(req.getFee())
                .hospitalName(req.getHospitalName().trim())
                .clinicAddress(req.getClinicAddress().trim())
                .lat(req.getLat())
                .lng(req.getLng())
                .city(city)
                .rating(4.0)
                .workingHoursStart(req.getWorkingHoursStart())
                .workingHoursEnd(req.getWorkingHoursEnd())
                .slotIntervalMinutes(req.getSlotIntervalMinutes())
                .build();
        final Doctor savedDoctor = doctorRepo.save(doctor);

        // Save doctor-service relationships
        if (req.getServiceIds() != null && !req.getServiceIds().isEmpty()) {
            for (Long serviceId : req.getServiceIds()) {
                svcRepo.findById(serviceId).ifPresent(svc -> {
                    DoctorMedicalService dms = DoctorMedicalService.builder()
                            .doctor(savedDoctor)
                            .service(svc)
                            .build();
                    dmsRepo.save(dms);
                });
            }
        }

        String token = jwt.generateToken(user.getId(), user.getRole().name());
        return AuthResponse.builder()
                .ok(true)
                .token(token)
                .user(buildUserResponse(user))
                .build();
    }

    public UserResponse getCurrentUser(User user) {
        return buildUserResponse(user);
    }

    public UserResponse buildUserResponse(User user) {
        UserResponse.UserResponseBuilder b = UserResponse.builder()
                .id(String.valueOf(user.getId()))
                .role(user.getRole().name())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone());

        if (user.getRole() == UserRole.DOCTOR) {
            doctorRepo.findByUserId(user.getId()).ifPresent(doc -> {
                b.city(doc.getCity())
                 .specialization(doc.getSpecialization())
                 .fee(doc.getFee())
                 .hospitalName(doc.getHospitalName())
                 .clinicAddress(doc.getClinicAddress())
                 .lat(doc.getLat())
                 .lng(doc.getLng())
                 .workingHoursStart(doc.getWorkingHoursStart())
                 .workingHoursEnd(doc.getWorkingHoursEnd())
                 .slotIntervalMinutes(doc.getSlotIntervalMinutes());
            });
        }

        return b.build();
    }

    public List<UserResponse> listUsersByRole(UserRole role) {
        return userRepo.findByRole(role).stream()
                .map(this::buildUserResponse)
                .collect(java.util.stream.Collectors.toList());
    }
}
