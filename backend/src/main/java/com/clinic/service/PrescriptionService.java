package com.clinic.service;

import com.clinic.dto.CreatePrescriptionRequest;
import com.clinic.dto.PrescriptionResponse;
import com.clinic.entity.*;
import com.clinic.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    private final PrescriptionRepository repo;

    public PrescriptionService(PrescriptionRepository repo) {
        this.repo = repo;
    }

    public List<PrescriptionResponse> listForPatient(Long patientId) {
        return repo.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PrescriptionResponse> listForDoctor(Long doctorId) {
        return repo.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<PrescriptionResponse> getById(Long id) {
        return repo.findById(id).map(this::toResponse);
    }

    public Optional<PrescriptionResponse> getByAppointmentId(Long appointmentId) {
        return repo.findByAppointmentId(appointmentId).map(this::toResponse);
    }

    @Transactional
    public PrescriptionResponse upsertForAppointment(CreatePrescriptionRequest req) {
        Optional<Prescription> existing = repo.findByAppointmentId(req.getAppointmentId());

        Prescription rx;
        if (existing.isPresent()) {
            rx = existing.get();
            updatePrescription(rx, req);
        } else {
            rx = createPrescription(req);
        }

        rx = repo.save(rx);
        return toResponse(rx);
    }

    private Prescription createPrescription(CreatePrescriptionRequest req) {
        Prescription rx = Prescription.builder()
                .appointmentId(req.getAppointmentId())
                .clinicName(req.getClinicName())
                .hospitalName(req.getHospitalName())
                .doctorName(req.getDoctorName())
                .doctorRegistrationNo(req.getDoctorRegistrationNo())
                .patientName(req.getPatientName())
                .age(req.getAge())
                .weight(req.getWeight())
                .gender(Gender.valueOf(req.getGender()))
                .diagnosis(req.getDiagnosis())
                .testRecommendations(req.getTestRecommendations())
                .doctorAdvice(req.getDoctorAdvice())
                .doctorId(req.getDoctorId())
                .patientId(req.getPatientId())
                .medicines(new ArrayList<>())
                .build();

        if (req.getMedicines() != null) {
            for (var m : req.getMedicines()) {
                PrescriptionMedicine med = PrescriptionMedicine.builder()
                        .prescription(rx)
                        .tabletName(m.getTabletName())
                        .breakfast(m.isBreakfast())
                        .lunch(m.isLunch())
                        .dinner(m.isDinner())
                        .foodInstruction(FoodInstruction.valueOf(m.getFoodInstruction()))
                        .durationDays(m.getDurationDays())
                        .build();
                rx.getMedicines().add(med);
            }
        }

        return rx;
    }

    private void updatePrescription(Prescription rx, CreatePrescriptionRequest req) {
        rx.setClinicName(req.getClinicName());
        rx.setHospitalName(req.getHospitalName());
        rx.setDoctorName(req.getDoctorName());
        rx.setDoctorRegistrationNo(req.getDoctorRegistrationNo());
        rx.setPatientName(req.getPatientName());
        rx.setAge(req.getAge());
        rx.setWeight(req.getWeight());
        rx.setGender(Gender.valueOf(req.getGender()));
        rx.setDiagnosis(req.getDiagnosis());
        rx.setTestRecommendations(req.getTestRecommendations());
        rx.setDoctorAdvice(req.getDoctorAdvice());

        rx.getMedicines().clear();
        if (req.getMedicines() != null) {
            for (var m : req.getMedicines()) {
                PrescriptionMedicine med = PrescriptionMedicine.builder()
                        .prescription(rx)
                        .tabletName(m.getTabletName())
                        .breakfast(m.isBreakfast())
                        .lunch(m.isLunch())
                        .dinner(m.isDinner())
                        .foodInstruction(FoodInstruction.valueOf(m.getFoodInstruction()))
                        .durationDays(m.getDurationDays())
                        .build();
                rx.getMedicines().add(med);
            }
        }
    }

    private PrescriptionResponse toResponse(Prescription rx) {
        List<PrescriptionResponse.MedicineResponse> meds = rx.getMedicines().stream()
                .map(m -> PrescriptionResponse.MedicineResponse.builder()
                        .id(String.valueOf(m.getId()))
                        .tabletName(m.getTabletName())
                        .breakfast(m.isBreakfast())
                        .lunch(m.isLunch())
                        .dinner(m.isDinner())
                        .foodInstruction(m.getFoodInstruction().name())
                        .durationDays(m.getDurationDays())
                        .build())
                .collect(Collectors.toList());

        return PrescriptionResponse.builder()
                .id(String.valueOf(rx.getId()))
                .appointmentId(String.valueOf(rx.getAppointmentId()))
                .clinicName(rx.getClinicName())
                .hospitalName(rx.getHospitalName())
                .doctorName(rx.getDoctorName())
                .doctorRegistrationNo(rx.getDoctorRegistrationNo())
                .patientName(rx.getPatientName())
                .age(rx.getAge())
                .weight(rx.getWeight())
                .gender(rx.getGender().name())
                .diagnosis(rx.getDiagnosis())
                .testRecommendations(rx.getTestRecommendations())
                .doctorAdvice(rx.getDoctorAdvice())
                .medicines(meds)
                .createdAtIso(rx.getCreatedAt() != null ? rx.getCreatedAt().toString() : null)
                .doctorId(String.valueOf(rx.getDoctorId()))
                .patientId(String.valueOf(rx.getPatientId()))
                .build();
    }
}
