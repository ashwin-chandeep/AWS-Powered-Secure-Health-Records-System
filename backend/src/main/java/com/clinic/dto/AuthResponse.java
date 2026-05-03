package com.clinic.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuthResponse {
    private boolean ok;
    private String message;
    private String token;
    private UserResponse user;
}
