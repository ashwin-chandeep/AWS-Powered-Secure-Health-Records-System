package com.clinic.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreatePrescriptionRequest {
    @NotNull
    private Long appointmentId;
    @NotBlank
    private String clinicName;
    @NotBlank
    private String hospitalName;
    @NotBlank
    private String doctorName;
    @NotBlank
    private String doctorRegistrationNo;
    @NotBlank
    private String patientName;
    @NotNull
    private Integer age;
    @NotNull
    private Double weight;
    @NotBlank
    private String gender;
    @NotBlank
    private String diagnosis;
    private String testRecommendations;
    @NotBlank
    private String doctorAdvice;
    @NotNull
    private Long doctorId;
    @NotNull
    private Long patientId;
    private List<MedicineDto> medicines;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class MedicineDto {
        private String tabletName;
        private boolean breakfast;
        private boolean lunch;
        private boolean dinner;
        private String foodInstruction;
        private int durationDays;
    }
}
