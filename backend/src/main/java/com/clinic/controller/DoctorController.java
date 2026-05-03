package com.clinic.controller;

import com.clinic.dto.DoctorResponse;
import com.clinic.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<List<DoctorResponse>> getDoctors(@RequestParam String city) {
        return ResponseEntity.ok(doctorService.getDoctorsByCity(city));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponse> getDoctor(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/specializations")
    public ResponseEntity<List<String>> getSpecializations(@RequestParam String city) {
        return ResponseEntity.ok(doctorService.getSpecializations(city));
    }
}
