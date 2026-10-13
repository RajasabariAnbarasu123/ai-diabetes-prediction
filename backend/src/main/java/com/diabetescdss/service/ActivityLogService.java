package com.diabetescdss.service;

import com.diabetescdss.enums.ActivityType;

public interface ActivityLogService {
    void logActivity(Long userId, ActivityType action, String ipAddress, String device, String browser);
}