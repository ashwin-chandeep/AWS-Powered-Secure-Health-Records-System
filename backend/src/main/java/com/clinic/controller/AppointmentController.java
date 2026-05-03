package com.clinic.controller;

import com.clinic.dto.AppointmentResponse;
import com.clinic.dto.CreateAppointmentRequest;
import com.clinic.entity.AppointmentStatus;
import com.clinic.entity.User;
import com.clinic.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> create(@AuthenticationPrincipal User user,
                                     @Valid @RequestBody CreateAppointmentRequest req) {
        try {
            AppointmentResponse res = service.createRequest(req, user.getId(), user.getName());
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("ok", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/patient")
    public ResponseEntity<List<AppointmentResponse>> listForPatient(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listForPatient(user.getId()));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<AppointmentResponse>> listForDoctor(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listForDoctor(user.getId()));
    }

    @GetMapping("/doctor/requests")
    public ResponseEntity<List<AppointmentResponse>> listDoctorRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listDoctorRequests(user.getId()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        AppointmentStatus status = AppointmentStatus.valueOf(statusStr);
        return service.updateStatus(id, status)
                .map(r -> ResponseEntity.ok((Object) r))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slot-locked")
    public ResponseEntity<Map<String, Boolean>> isSlotLocked(
            @RequestParam Long doctorId, @RequestParam String slotIso) {
        boolean locked = service.isSlotLocked(doctorId, slotIso);
        return ResponseEntity.ok(Map.of("locked", locked));
    }
}
