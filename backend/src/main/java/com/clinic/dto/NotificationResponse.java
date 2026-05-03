package com.clinic.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NotificationResponse {
    private String id;
    private String userId;
    private String type;
    private String title;
    private String message;
    private String createdAtIso;
    private boolean read;
    private Object meta;
}
