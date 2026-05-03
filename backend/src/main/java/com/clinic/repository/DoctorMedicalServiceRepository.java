package com.clinic.repository;

import com.clinic.entity.DoctorMedicalService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorMedicalServiceRepository extends JpaRepository<DoctorMedicalService, Long> {
    List<DoctorMedicalService> findByDoctorId(Long doctorId);
    void deleteByDoctorId(Long doctorId);
}
