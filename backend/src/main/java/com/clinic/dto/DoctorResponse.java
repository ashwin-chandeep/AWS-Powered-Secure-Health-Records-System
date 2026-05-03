package com.clinic.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DoctorResponse {
    private String id;
    private String name;
    private String hospitalName;
    private String specialization;
    private double fee;
    private String timings;
    private String clinicAddress;
    private double lat;
    private double lng;
    private double rating;
    private String city;
    private List<ServiceResponse> services;
}
