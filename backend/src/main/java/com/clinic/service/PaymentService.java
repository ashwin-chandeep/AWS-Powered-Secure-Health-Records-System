package com.clinic.service;

import com.clinic.dto.PaymentResponse;
import com.clinic.entity.*;
import com.clinic.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository repo;

    public PaymentService(PaymentRepository repo) {
        this.repo = repo;
    }

    public PaymentResponse initiatePayment(Long appointmentId, Long patientId, Long doctorId,
                                            String patientName, String doctorName,
                                            String serviceName, double amount) {
        // Check if payment already exists for this appointment
        Optional<Payment> existing = repo.findByAppointmentId(appointmentId);
        if (existing.isPresent()) {
            return toResponse(existing.get());
        }

        Payment payment = Payment.builder()
                .appointmentId(appointmentId)
                .patientId(patientId)
                .doctorId(doctorId)
                .patientName(patientName)
                .doctorName(doctorName)
                .serviceName(serviceName)
                .amount(amount)
                .status(PaymentStatus.PENDING)
                .build();

        payment = repo.save(payment);
        return toResponse(payment);
    }

    public Optional<PaymentResponse> completePayment(Long paymentId, String method) {
        return repo.findById(paymentId).map(payment -> {
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setPaymentMethod(PaymentMethod.valueOf(method));
            payment.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase());
            payment.setPaidAt(Instant.now());
            return toResponse(repo.save(payment));
        });
    }

    public List<PaymentResponse> listForPatient(Long patientId) {
        return repo.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<PaymentResponse> listForDoctor(Long doctorId) {
        return repo.findByDoctorIdOrderByCreatedAtDesc(doctorId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Optional<PaymentResponse> getByAppointmentId(Long appointmentId) {
        return repo.findByAppointmentId(appointmentId).map(this::toResponse);
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(String.valueOf(p.getId()))
                .appointmentId(String.valueOf(p.getAppointmentId()))
                .patientId(String.valueOf(p.getPatientId()))
                .doctorId(String.valueOf(p.getDoctorId()))
                .patientName(p.getPatientName())
                .doctorName(p.getDoctorName())
                .serviceName(p.getServiceName())
                .amount(p.getAmount())
                .status(p.getStatus().name())
                .paymentMethod(p.getPaymentMethod() != null ? p.getPaymentMethod().name() : null)
                .transactionId(p.getTransactionId())
                .createdAtIso(p.getCreatedAt() != null ? p.getCreatedAt().toString() : null)
                .paidAtIso(p.getPaidAt() != null ? p.getPaidAt().toString() : null)
                .build();
    }
}
