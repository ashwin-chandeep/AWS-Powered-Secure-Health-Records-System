package com.clinic.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "doctors")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private double fee;

    @Column(nullable = false)
    private String hospitalName;

    @Column(nullable = false)
    private String clinicAddress;

    @Column(nullable = false)
    private double lat;

    @Column(nullable = false)
    private double lng;

    private double rating;

    @Column(nullable = false, length = 20)
    private String city;

    private String timings;

    private String workingHoursStart;

    private String workingHoursEnd;

    private Integer slotIntervalMinutes;

    @Column(updatable = false)
    private Instant createdAt;

    @PrePersist
    void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
