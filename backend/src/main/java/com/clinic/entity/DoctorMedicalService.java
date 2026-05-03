package com.clinic.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctor_services", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"doctor_id", "service_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DoctorMedicalService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private MedicalService service;
}
