package com.diabetescdss.service;

import com.diabetescdss.dto.response.AnalyticsResponse;

public interface AnalyticsService {
    AnalyticsResponse getAnalytics(Long userId);
}