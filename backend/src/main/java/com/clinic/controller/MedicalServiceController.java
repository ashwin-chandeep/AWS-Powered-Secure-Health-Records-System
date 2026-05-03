package com.clinic.controller;

import com.clinic.dto.ServiceResponse;
import com.clinic.service.MedicalServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class MedicalServiceController {

    private final MedicalServiceService service;

    public MedicalServiceController(MedicalServiceService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ServiceResponse>> getServices(@RequestParam(required = false) String city) {
        return ResponseEntity.ok(service.getServicesByCity(city));
    }
}
