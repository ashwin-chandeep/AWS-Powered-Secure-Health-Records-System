package com.clinic.repository;

import com.clinic.entity.AccessRequest;
import com.clinic.entity.AccessRequestStatus;
import com.clinic.entity.AccessScope;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AccessRequestRepository extends JpaRepository<AccessRequest, Long> {
    List<AccessRequest> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
    List<AccessRequest> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    Optional<AccessRequest> findByDoctorIdAndPatientIdAndStatus(Long doctorId, Long patientId, AccessRequestStatus status);
    boolean existsByPatientIdAndStatusAndApprovedScope(Long patientId, AccessRequestStatus status, AccessScope scope);
    boolean existsByDoctorIdAndPatientIdAndStatusAndApprovedScopeIn(Long doctorId, Long patientId, AccessRequestStatus status, List<AccessScope> scopes);
    boolean existsByPatientIdAndStatusAndApprovedScopeIn(Long patientId, AccessRequestStatus status, List<AccessScope> scopes);
}
