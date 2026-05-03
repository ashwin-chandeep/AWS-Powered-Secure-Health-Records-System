package com.clinic.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppointmentResponse {
    private String id;
    private String city;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private String hospitalName;
    private String specialization;
    private String serviceId;
    private String serviceName;
    private String slotIso;
    private String endIso;
    private String status;
    private String createdAtIso;
}
