package com.diabetescdss.service.impl;

import com.diabetescdss.enums.ActivityType;
import com.diabetescdss.model.ActivityLog;
import com.diabetescdss.model.User;
import com.diabetescdss.repository.ActivityLogRepository;
import com.diabetescdss.repository.UserRepository;
import com.diabetescdss.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    @PostConstruct
    public void initSeedLogs() {
        try {
            if (activityLogRepository.count() == 0) {
                User user = userRepository.findAll().stream().findFirst().orElse(null);

                activityLogRepository.save(ActivityLog.builder()
                        .user(user)
                        .action(ActivityType.LOGIN)
                        .ipAddress("127.0.0.1")
                        .device("Desktop Web")
                        .browser("Chrome 122")
                        .timestamp(LocalDateTime.now().minusMinutes(45))
                        .build());

                activityLogRepository.save(ActivityLog.builder()
                        .user(user)
                        .action(ActivityType.PREDICTION)
                        .ipAddress("127.0.0.1")
                        .device("Desktop Web")
                        .browser("Chrome 122")
                        .timestamp(LocalDateTime.now().minusMinutes(20))
                        .build());

                activityLogRepository.save(ActivityLog.builder()
                        .user(user)
                        .action(ActivityType.PROFILE_UPDATE)
                        .ipAddress("127.0.0.1")
                        .device("Desktop Web")
                        .browser("Chrome 122")
                        .timestamp(LocalDateTime.now().minusMinutes(5))
                        .build());
            }
        } catch (Exception ignored) {}
    }

    @Override
    public void logActivity(Long userId, ActivityType action, String ipAddress, String device, String browser) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }
        ActivityLog log = ActivityLog.builder()
                .user(user)
                .action(action)
                .ipAddress(ipAddress)
                .device(device)
                .browser(browser)
                .timestamp(LocalDateTime.now())
                .build();
        activityLogRepository.save(log);
    }
}