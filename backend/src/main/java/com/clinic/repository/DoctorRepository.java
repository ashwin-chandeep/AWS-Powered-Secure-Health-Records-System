package com.clinic.repository;

import com.clinic.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByCity(String city);
    Optional<Doctor> findByUserId(Long userId);
}
