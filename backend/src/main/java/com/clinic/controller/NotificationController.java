package com.clinic.controller;

import com.clinic.dto.CreateNotificationRequest;
import com.clinic.dto.NotificationResponse;
import com.clinic.entity.User;
import com.clinic.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> list(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.listForUser(user.getId()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unreadCount(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of("count", service.unreadCount(user.getId())));
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> create(@Valid @RequestBody CreateNotificationRequest req) {
        Long userId = Long.valueOf(req.getUserId());
        return ResponseEntity.ok(service.create(userId, req.getType(), req.getTitle(), req.getMessage(), req.getMeta()));
    }

    @PutMapping("/mark-read")
    public ResponseEntity<Map<String, Boolean>> markRead(@AuthenticationPrincipal User user) {
        service.markAllRead(user.getId());
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
