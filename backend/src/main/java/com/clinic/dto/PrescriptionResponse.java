package com.clinic.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PrescriptionResponse {
    private String id;
    private String appointmentId;
    private String clinicName;
    private String hospitalName;
    private String doctorName;
    private String doctorRegistrationNo;
    private String patientName;
    private int age;
    private double weight;
    private String gender;
    private String diagnosis;
    private String testRecommendations;
    private String doctorAdvice;
    private List<MedicineResponse> medicines;
    private String createdAtIso;
    private String doctorId;
    private String patientId;

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class MedicineResponse {
        private String id;
        private String tabletName;
        private boolean breakfast;
        private boolean lunch;
        private boolean dinner;
        private String foodInstruction;
        private int durationDays;
    }
}
