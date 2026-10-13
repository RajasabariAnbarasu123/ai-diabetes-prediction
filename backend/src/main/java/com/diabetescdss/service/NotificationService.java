package com.diabetescdss.service;

import com.diabetescdss.dto.response.NotificationResponse;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getNotifications(Long userId);
    void markAsRead(Long userId, Long notificationId);
}