package com.diabetescdss.service;

import com.diabetescdss.dto.response.ActivityLogResponse;
import com.diabetescdss.dto.response.AdminStatsResponse;
import com.diabetescdss.dto.response.PredictionResponse;
import com.diabetescdss.dto.response.ProfileResponse;
import com.diabetescdss.dto.response.ReportUploadResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    AdminStatsResponse getStats();
    Page<ProfileResponse> getUsers(Pageable pageable, String search);
    void disableUser(Long userId);
    void enableUser(Long userId);
    void deleteUser(Long userId);
    Page<PredictionResponse> getAllPredictions(Pageable pageable, String search, String risk);
    Page<ReportUploadResponse> getAllReports(Pageable pageable);
    Page<ActivityLogResponse> getActivityLogs(Pageable pageable);
}