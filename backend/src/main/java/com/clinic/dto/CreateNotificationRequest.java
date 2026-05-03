package com.clinic.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class CreateNotificationRequest {
    @NotBlank
    private String userId;
    @NotBlank
    private String type;
    @NotBlank
    private String title;
    @NotBlank
    private String message;
    private Object meta;
}
