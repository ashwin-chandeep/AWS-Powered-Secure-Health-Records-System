package com.clinic.controller;

import com.clinic.dto.PaymentResponse;
import com.clinic.entity.User;
import com.clinic.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponse> initiate(@RequestBody Map<String, Object> body) {
        Long appointmentId = Long.valueOf(String.valueOf(body.get("appointmentId")));
        Long patientId = Long.valueOf(String.valueOf(body.get("patientId")));
        Long doctorId = Long.valueOf(String.valueOf(body.get("doctorId")));
        String patientName = String.valueOf(body.get("patientName"));
        String doctorName = String.valueOf(body.get("doctorName"));
        String serviceName = String.valueOf(body.get("serviceName"));
        double amount = Double.parseDouble(String.valueOf(body.get("amount")));

        PaymentResponse res = service.initiatePayment(appointmentId, patientId, doctorId,
                patientName, doctorName, serviceName, amount);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String method = body.get("paymentMethod");
        return service.completePayment(id, method)
                .map(r -> ResponseEntity.ok((Object) r))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient")
    public ResponseEntity<List<PaymentResponse>> listForPatient(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listForPatient(user.getId()));
    }

    @GetMapping("/doctor")
    public ResponseEntity<List<PaymentResponse>> listForDoctor(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listForDoctor(user.getId()));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<PaymentResponse> getByAppointment(@PathVariable Long appointmentId) {
        return service.getByAppointmentId(appointmentId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
