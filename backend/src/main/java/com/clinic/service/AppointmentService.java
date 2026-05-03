package com.clinic.service;

import com.clinic.dto.AppointmentResponse;
import com.clinic.dto.CreateAppointmentRequest;
import com.clinic.entity.Appointment;
import com.clinic.entity.AppointmentStatus;
import com.clinic.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) {
        this.repo = repo;
    }

    public AppointmentResponse createRequest(CreateAppointmentRequest req, Long patientId, String patientName) {
        // Check slot availability
        boolean slotTaken = repo.existsByDoctorIdAndSlotIsoAndStatusNot(
                req.getDoctorId(), req.getSlotIso(), AppointmentStatus.REJECTED);
        if (slotTaken) {
            throw new RuntimeException("This slot is no longer available. Please choose another time.");
        }

        Appointment appt = Appointment.builder()
                .city(req.getCity())
                .patientId(patientId)
                .patientName(patientName)
                .doctorId(req.getDoctorId())
                .doctorName(req.getDoctorName())
                .hospitalName(req.getHospitalName())
                .specialization(req.getSpecialization())
                .serviceId(req.getServiceId())
                .serviceName(req.getServiceName())
                .slotIso(req.getSlotIso())
                .endIso(req.getEndIso())
                .status(AppointmentStatus.REQUESTED)
                .build();

        appt = repo.save(appt);
        return toResponse(appt);
    }

    public List<AppointmentResponse> listForPatient(Long patientId) {
        return autoCompleteAndMap(repo.findByPatientIdOrderByCreatedAtDesc(patientId));
    }

    public List<AppointmentResponse> listForDoctor(Long doctorId) {
        return autoCompleteAndMap(repo.findByDoctorIdOrderByCreatedAtDesc(doctorId));
    }

    public List<AppointmentResponse> listDoctorRequests(Long doctorId) {
        return repo.findByDoctorIdAndStatus(doctorId, AppointmentStatus.REQUESTED).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<AppointmentResponse> updateStatus(Long id, AppointmentStatus status) {
        return repo.findById(id).map(appt -> {
            appt.setStatus(status);
            return toResponse(repo.save(appt));
        });
    }

    public boolean isSlotLocked(Long doctorId, String slotIso) {
        return repo.existsByDoctorIdAndSlotIsoAndStatusNot(doctorId, slotIso, AppointmentStatus.REJECTED);
    }

    private List<AppointmentResponse> autoCompleteAndMap(List<Appointment> list) {
        long nowMs = System.currentTimeMillis();
        for (Appointment a : list) {
            if (a.getStatus() == AppointmentStatus.ACCEPTED) {
                String endIso = a.getEndIso();
                if (endIso == null || endIso.isBlank()) {
                    endIso = computeEndIso(a.getSlotIso(), 60);
                    a.setEndIso(endIso);
                }
                try {
                    long endMs = Instant.parse(endIso).toEpochMilli();
                    if (nowMs >= endMs) {
                        a.setStatus(AppointmentStatus.COMPLETED);
                    }
                } catch (Exception ignored) {}
                repo.save(a);
            }
        }
        return list.stream().map(this::toResponse).collect(Collectors.toList());
    }

    private String computeEndIso(String startIso, int minutes) {
        try {
            Instant start = Instant.parse(startIso);
            return start.plusSeconds(minutes * 60L).toString();
        } catch (Exception e) {
            return startIso;
        }
    }

    private AppointmentResponse toResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(String.valueOf(a.getId()))
                .city(a.getCity())
                .patientId(String.valueOf(a.getPatientId()))
                .patientName(a.getPatientName())
                .doctorId(String.valueOf(a.getDoctorId()))
                .doctorName(a.getDoctorName())
                .hospitalName(a.getHospitalName())
                .specialization(a.getSpecialization())
                .serviceId(String.valueOf(a.getServiceId()))
                .serviceName(a.getServiceName())
                .slotIso(a.getSlotIso())
                .endIso(a.getEndIso())
                .status(a.getStatus().name())
                .createdAtIso(a.getCreatedAt() != null ? a.getCreatedAt().toString() : null)
                .build();
    }
}
