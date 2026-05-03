package com.clinic.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RegisterDoctorRequest {
    @NotBlank
    private String name;
    @NotBlank @Email
    private String email;
    @NotBlank
    private String phone;
    @NotBlank
    private String password;
    @NotBlank
    private String hospitalName;
    @NotBlank
    private String specialization;
    @NotNull
    private Double fee;
    @NotBlank
    private String clinicAddress;
    @NotNull
    private Double lat;
    @NotNull
    private Double lng;
    private String workingHoursStart;
    private String workingHoursEnd;
    private Integer slotIntervalMinutes;
    private List<Long> serviceIds;
}
