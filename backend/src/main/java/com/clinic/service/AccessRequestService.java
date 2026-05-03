package com.clinic.service;

import com.clinic.dto.AccessRequestResponse;
import com.clinic.entity.*;
import com.clinic.repository.AccessRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccessRequestService {

    private final AccessRequestRepository repo;

    public AccessRequestService(AccessRequestRepository repo) {
        this.repo = repo;
    }

    public List<AccessRequestResponse> listForDoctor(Long doctorId) {
        return repo.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public List<AccessRequestResponse> listForPatient(Long patientId) {
        return repo.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public AccessRequestResponse createRequest(Long doctorId, String doctorName,
                                                Long patientId, String patientName) {
        // If pending request already exists, return it
        Optional<AccessRequest> existing = repo.findByDoctorIdAndPatientIdAndStatus(
                doctorId, patientId, AccessRequestStatus.PENDING);
        if (existing.isPresent()) {
            return toResponse(existing.get());
        }

        AccessRequest ar = AccessRequest.builder()
                .doctorId(doctorId)
                .doctorName(doctorName)
                .patientId(patientId)
                .patientName(patientName)
                .status(AccessRequestStatus.PENDING)
                .build();
        ar = repo.save(ar);
        return toResponse(ar);
    }

    public Optional<AccessRequestResponse> approve(Long id, AccessScope scope) {
        return repo.findById(id).map(ar -> {
            ar.setStatus(AccessRequestStatus.APPROVED);
            ar.setApprovedScope(scope);
            return toResponse(repo.save(ar));
        });
    }

    public Optional<AccessRequestResponse> reject(Long id) {
        return repo.findById(id).map(ar -> {
            ar.setStatus(AccessRequestStatus.REJECTED);
            ar.setApprovedScope(null);
            return toResponse(repo.save(ar));
        });
    }

    public boolean hasAccess(Long doctorId, Long patientId) {
        // Check direct approval for this doctor
        boolean direct = repo.existsByDoctorIdAndPatientIdAndStatusAndApprovedScopeIn(
                doctorId, patientId, AccessRequestStatus.APPROVED,
                List.of(AccessScope.THIS_DOCTOR, AccessScope.ALL_DOCTORS));
        if (direct) return true;

        // Check if patient approved ALL_DOCTORS for any doctor
        return repo.existsByPatientIdAndStatusAndApprovedScopeIn(
                patientId, AccessRequestStatus.APPROVED, List.of(AccessScope.ALL_DOCTORS));
    }

    private AccessRequestResponse toResponse(AccessRequest ar) {
        return AccessRequestResponse.builder()
                .id(String.valueOf(ar.getId()))
                .doctorId(String.valueOf(ar.getDoctorId()))
                .doctorName(ar.getDoctorName())
                .patientId(String.valueOf(ar.getPatientId()))
                .patientName(ar.getPatientName())
                .status(ar.getStatus().name())
                .approvedScope(ar.getApprovedScope() != null ? ar.getApprovedScope().name() : null)
                .createdAtIso(ar.getCreatedAt() != null ? ar.getCreatedAt().toString() : null)
                .updatedAtIso(ar.getUpdatedAt() != null ? ar.getUpdatedAt().toString() : null)
                .build();
    }
}
