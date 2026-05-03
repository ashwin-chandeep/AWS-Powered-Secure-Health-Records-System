package com.clinic.service;

import com.clinic.dto.NotificationResponse;
import com.clinic.entity.Notification;
import com.clinic.entity.NotificationType;
import com.clinic.repository.NotificationRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository repo;
    private final ObjectMapper objectMapper;

    public NotificationService(NotificationRepository repo, ObjectMapper objectMapper) {
        this.repo = repo;
        this.objectMapper = objectMapper;
    }

    public List<NotificationResponse> listForUser(Long userId) {
        return repo.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public long unreadCount(Long userId) {
        return repo.countByUserIdAndIsReadFalse(userId);
    }

    public NotificationResponse create(Long userId, String type, String title, String message, Object meta) {
        String metaJson = null;
        if (meta != null) {
            try {
                metaJson = objectMapper.writeValueAsString(meta);
            } catch (JsonProcessingException ignored) {}
        }

        Notification n = Notification.builder()
                .userId(userId)
                .type(NotificationType.valueOf(type))
                .title(title)
                .message(message)
                .isRead(false)
                .meta(metaJson)
                .build();
        n = repo.save(n);
        return toResponse(n);
    }

    public void markAllRead(Long userId) {
        List<Notification> unread = repo.findByUserIdAndIsReadFalse(userId);
        for (Notification n : unread) {
            n.setRead(true);
        }
        repo.saveAll(unread);
    }

    private NotificationResponse toResponse(Notification n) {
        Object meta = null;
        if (n.getMeta() != null) {
            try {
                meta = objectMapper.readValue(n.getMeta(), Object.class);
            } catch (JsonProcessingException ignored) {}
        }

        return NotificationResponse.builder()
                .id(String.valueOf(n.getId()))
                .userId(String.valueOf(n.getUserId()))
                .type(n.getType().name())
                .title(n.getTitle())
                .message(n.getMessage())
                .createdAtIso(n.getCreatedAt() != null ? n.getCreatedAt().toString() : null)
                .read(n.isRead())
                .meta(meta)
                .build();
    }
}
