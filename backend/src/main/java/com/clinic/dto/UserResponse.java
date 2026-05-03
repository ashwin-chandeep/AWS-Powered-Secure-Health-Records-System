package com.clinic.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserResponse {
    private String id;
    private String role;
    private String name;
    private String email;
    private String phone;

    // Doctor-specific fields
    private String city;
    private String specialization;
    private Double fee;
    private String hospitalName;
    private String clinicAddress;
    private Double lat;
    private Double lng;
    private String workingHoursStart;
    private String workingHoursEnd;
    private Integer slotIntervalMinutes;
}
