package com.clinic.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {
    // CORS is now handled by SecurityConfig via Spring Security's built-in CORS support.
    // This class is kept for any future web configuration needs.
}
