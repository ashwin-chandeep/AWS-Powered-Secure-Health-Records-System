package com.clinic.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AccessRequestResponse {
    private String id;
    private String doctorId;
    private String doctorName;
    private String patientId;
    private String patientName;
    private String status;
    private String approvedScope;
    private String createdAtIso;
    private String updatedAtIso;
}
