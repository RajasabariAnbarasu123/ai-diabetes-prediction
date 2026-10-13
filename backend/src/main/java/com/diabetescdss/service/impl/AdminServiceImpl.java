package com.diabetescdss.service.impl;

import com.diabetescdss.dto.response.ActivityLogResponse;
import com.diabetescdss.dto.response.AdminStatsResponse;
import com.diabetescdss.dto.response.PredictionResponse;
import com.diabetescdss.dto.response.ProfileResponse;
import com.diabetescdss.dto.response.ReportUploadResponse;
import com.diabetescdss.exception.ResourceNotFoundException;
import com.diabetescdss.mapper.UserMapper;
import com.diabetescdss.model.User;
import com.diabetescdss.repository.*;
import com.diabetescdss.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diabetescdss.mapper.PredictionMapper;
import com.diabetescdss.model.Prediction;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PredictionRepository predictionRepository;
    private final MedicalReportRepository reportRepository;
    private final ExtractedReportDataRepository extractedReportDataRepository;
    private final ActivityLogRepository activityLogRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final NotificationRepository notificationRepository;
    private final HealthScoreRepository healthScoreRepository;
    private final ComparisonHistoryRepository comparisonHistoryRepository;
    private final AnalyticsCacheRepository analyticsCacheRepository;
    private final AiChatHistoryRepository aiChatHistoryRepository;
    private final MedicationRepository medicationRepository;
    private final MedicationReminderRepository medicationReminderRepository;
    private final UserMapper userMapper;
    private final PredictionMapper predictionMapper;

    @Override
    public AdminStatsResponse getStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByEnabled(true);
        long disabledUsers = userRepository.countByEnabled(false);
        long totalPredictions = predictionRepository.count();
        long totalReports = reportRepository.count();

        long highRiskCount = predictionRepository.countByDiabetesRisk(com.diabetescdss.enums.RiskLevel.HIGH)
                + predictionRepository.countByDiabetesRisk(com.diabetescdss.enums.RiskLevel.CRITICAL);
        long moderateRiskCount = predictionRepository.countByDiabetesRisk(com.diabetescdss.enums.RiskLevel.MODERATE);
        long lowRiskCount = predictionRepository.countByDiabetesRisk(com.diabetescdss.enums.RiskLevel.LOW);

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.util.List<AdminStatsResponse.MonthlyTrend> monthlyTrends = new java.util.ArrayList<>();
        java.time.format.DateTimeFormatter monthFormatter = java.time.format.DateTimeFormatter.ofPattern("MMM");

        for (int i = 5; i >= 0; i--) {
            java.time.LocalDateTime startOfMonth = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            java.time.LocalDateTime endOfMonth = startOfMonth.plusMonths(1).minusNanos(1);
            long count = predictionRepository.countByCreatedAtBetween(startOfMonth, endOfMonth);
            monthlyTrends.add(new AdminStatsResponse.MonthlyTrend(startOfMonth.format(monthFormatter), count));
        }

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .disabledUsers(disabledUsers)
                .totalPredictions(totalPredictions)
                .totalReports(totalReports)
                .highRiskCount(highRiskCount)
                .moderateRiskCount(moderateRiskCount)
                .lowRiskCount(lowRiskCount)
                .monthlyTrends(monthlyTrends)
                .build();
    }

    @Override
    public Page<ProfileResponse> getUsers(Pageable pageable, String search) {
        Page<User> page;
        if (search != null && !search.isBlank()) {
            page = userRepository.findByEmailContainingIgnoreCase(search, pageable);
        } else {
            page = userRepository.findAll(pageable);
        }
        return page.map(userMapper::toProfileResponse);
    }

    @Override
    @Transactional
    public void disableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(false);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void enableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        refreshTokenRepository.deleteByUserId(userId);
        passwordResetTokenRepository.deleteByUserId(userId);
        emailVerificationTokenRepository.deleteByUserId(userId);
        notificationRepository.deleteByUserId(userId);
        healthScoreRepository.deleteByUserId(userId);
        comparisonHistoryRepository.deleteByUserId(userId);
        analyticsCacheRepository.deleteByUserId(userId);
        aiChatHistoryRepository.deleteByUserId(userId);
        medicationReminderRepository.deleteByUserId(userId);
        medicationRepository.deleteByUserId(userId);
        extractedReportDataRepository.deleteByUserId(userId);
        reportRepository.deleteByUserId(userId);
        predictionRepository.deleteByUserId(userId);
        activityLogRepository.deleteByUserId(userId);

        user.getRoles().clear();
        userRepository.save(user);
        userRepository.delete(user);
    }

    @Override
    public Page<PredictionResponse> getAllPredictions(Pageable pageable, String search, String risk) {
        com.diabetescdss.enums.RiskLevel riskLevelEnum = null;
        if (risk != null && !risk.isBlank() && !"ALL".equalsIgnoreCase(risk)) {
            try {
                riskLevelEnum = com.diabetescdss.enums.RiskLevel.valueOf(risk.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Ignore invalid risk enum value
            }
        }

        Page<Prediction> page;
        if ((search != null && !search.isBlank()) || riskLevelEnum != null) {
            page = predictionRepository.findBySearchAndRisk(search, riskLevelEnum, pageable);
        } else {
            page = predictionRepository.findAll(pageable);
        }
        return page.map(predictionMapper::toResponse);
    }

    @Override
    public Page<ReportUploadResponse> getAllReports(Pageable pageable) {
        return reportRepository.findAll(pageable)
                .map(r -> new ReportUploadResponse());
    }

    @Override
    public Page<com.diabetescdss.dto.response.ActivityLogResponse> getActivityLogs(Pageable pageable) {
        return activityLogRepository.findAllByOrderByTimestampDesc(pageable)
                .map(log -> com.diabetescdss.dto.response.ActivityLogResponse.builder()
                        .id(log.getId())
                        .userId(log.getUser() != null ? log.getUser().getId() : null)
                        .userName(log.getUser() != null ? log.getUser().getName() : "System User")
                        .userEmail(log.getUser() != null ? log.getUser().getEmail() : "system@diabetescdss.org")
                        .action(log.getAction())
                        .ipAddress(log.getIpAddress() != null ? log.getIpAddress() : "127.0.0.1")
                        .device(log.getDevice() != null ? log.getDevice() : "Web Client")
                        .browser(log.getBrowser() != null ? log.getBrowser() : "Browser")
                        .timestamp(log.getTimestamp() != null ? log.getTimestamp() : java.time.LocalDateTime.now())
                        .status("COMPLETED")
                        .build());
    }
}