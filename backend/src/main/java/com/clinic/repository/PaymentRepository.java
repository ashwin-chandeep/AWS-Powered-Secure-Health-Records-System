package com.clinic.repository;

import com.clinic.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<Payment> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);
    Optional<Payment> findByAppointmentId(Long appointmentId);
    Optional<Payment> findByTransactionId(String transactionId);
}
