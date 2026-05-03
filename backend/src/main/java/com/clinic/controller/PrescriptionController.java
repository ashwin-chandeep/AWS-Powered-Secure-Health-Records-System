package com.clinic.controller;

import com.clinic.dto.CreatePrescriptionRequest;
import com.clinic.dto.PrescriptionResponse;
import com.clinic.service.PdfService;
import com.clinic.service.PrescriptionService;
import com.clinic.service.AccessRequestService;
import com.clinic.entity.User;
import com.clinic.entity.UserRole;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService service;
    private final PdfService pdfService;
    private final AccessRequestService accessService;

    public PrescriptionController(PrescriptionService service, PdfService pdfService, AccessRequestService accessService) {
        this.service = service;
        this.pdfService = pdfService;
        this.accessService = accessService;
    }

    @PostMapping
    public ResponseEntity<?> upsert(@Valid @RequestBody CreatePrescriptionRequest req) {
        try {
            PrescriptionResponse res = service.upsertForAppointment(req);
            return ResponseEntity.ok(Map.of("ok", true, "prescription", res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("ok", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionResponse>> listForPatient(
            @PathVariable Long patientId,
            @AuthenticationPrincipal User user) {
        
        if (user.getRole() == UserRole.PATIENT) {
            if (!user.getId().equals(patientId)) {
                return ResponseEntity.status(403).build();
            }
        } else if (user.getRole() == UserRole.DOCTOR) {
            boolean hasAccess = accessService.hasAccess(user.getId(), patientId);
            if (!hasAccess) {
                return ResponseEntity.status(403).build();
            }
        }

        return ResponseEntity.ok(service.listForPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionResponse>> listForDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(service.listForDoctor(doctorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionResponse> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<PrescriptionResponse> getByAppointment(@PathVariable Long appointmentId) {
        return service.getByAppointmentId(appointmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        return pdfService.generatePrescriptionPdf(id)
                .map(bytes -> {
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_PDF);
                    headers.setContentDispositionFormData("attachment",
                            "prescription-" + id + ".pdf");
                    headers.setContentLength(bytes.length);
                    return ResponseEntity.ok().headers(headers).body(bytes);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
