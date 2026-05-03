package com.clinic.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ServiceResponse {
    private String id;
    private String name;
    private String city;
}
