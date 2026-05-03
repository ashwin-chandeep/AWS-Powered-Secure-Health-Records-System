package com.clinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateAppointmentRequest {
    @NotBlank
    private String city;
    @NotNull
    private Long doctorId;
    @NotBlank
    private String doctorName;
    @NotBlank
    private String hospitalName;
    @NotBlank
    private String specialization;
    @NotNull
    private Long serviceId;
    @NotBlank
    private String serviceName;
    @NotBlank
    private String slotIso;
    private String endIso;
}
