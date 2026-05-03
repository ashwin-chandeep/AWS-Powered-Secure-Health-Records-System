package com.clinic.entity;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "prescription_medicines")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PrescriptionMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    @JsonIgnore
    private Prescription prescription;

    @Column(nullable = false)
    private String tabletName;

    @Column(nullable = false)
    private boolean breakfast;

    @Column(nullable = false)
    private boolean lunch;

    @Column(nullable = false)
    private boolean dinner;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private FoodInstruction foodInstruction;

    @Column(nullable = false)
    private int durationDays;
}
