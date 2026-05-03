package com.clinic.controller;

import com.clinic.dto.AccessRequestResponse;
import com.clinic.dto.CreateAccessRequestRequest;
import com.clinic.entity.AccessScope;
import com.clinic.entity.User;
import com.clinic.service.AccessRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/access-requests")
public class AccessRequestController {

    private final AccessRequestService service;

    public AccessRequestController(AccessRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<AccessRequestResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateAccessRequestRequest req) {
        return ResponseEntity.ok(service.createRequest(
                user.getId(), user.getName(),
                req.getPatientId(), req.getPatientName()));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<AccessRequestResponse>> listForDoctor(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listForDoctor(user.getId()));
    }

    @GetMapping("/patient")
    public ResponseEntity<List<AccessRequestResponse>> listForPatient(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listForPatient(user.getId()));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String scopeStr = body.get("scope");
        AccessScope scope = AccessScope.valueOf(scopeStr);
        return service.approve(id, scope)
                .map(r -> ResponseEntity.ok((Object) r))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        return service.reject(id)
                .map(r -> ResponseEntity.ok((Object) r))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/has-access")
    public ResponseEntity<Map<String, Boolean>> hasAccess(
            @RequestParam Long doctorId, @RequestParam Long patientId) {
        boolean access = service.hasAccess(doctorId, patientId);
        return ResponseEntity.ok(Map.of("hasAccess", access));
    }
}
