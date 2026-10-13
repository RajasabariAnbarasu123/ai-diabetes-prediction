package com.diabetescdss.controller;

import com.diabetescdss.dto.response.NotificationResponse;
import com.diabetescdss.security.CustomUserDetails;
import com.diabetescdss.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> list(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(notificationService.getNotifications(user.getUser().getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@AuthenticationPrincipal CustomUserDetails user,
                                         @PathVariable Long id) {
        notificationService.markAsRead(user.getUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}