package com.clinic.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentResponse {
    private String id;
    private String appointmentId;
    private String patientId;
    private String doctorId;
    private String patientName;
    private String doctorName;
    private String serviceName;
    private double amount;
    private String status;
    private String paymentMethod;
    private String transactionId;
    private String createdAtIso;
    private String paidAtIso;
}
