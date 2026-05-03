package com.clinic.repository;

import com.clinic.entity.MedicalService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MedicalServiceRepository extends JpaRepository<MedicalService, Long> {
    List<MedicalService> findByCity(String city);
}
