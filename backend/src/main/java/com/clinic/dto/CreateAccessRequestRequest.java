package com.clinic.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateAccessRequestRequest {
    @NotNull
    private Long patientId;
    private String patientName;
}
