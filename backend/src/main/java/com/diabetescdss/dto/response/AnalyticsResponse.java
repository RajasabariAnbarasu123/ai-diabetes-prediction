package com.diabetescdss.dto.response;

import lombok.*;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponse {
    private long totalPredictions;
    private double averageHbA1c;
    private double averageBloodSugar;
    private Map<String, Long> riskDistribution; // e.g., "Low": 5, "High": 2
    private List<MonthlyTrend> monthlyTrend;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyTrend {
        private String month;
        private double value; // e.g., number of predictions or avg HbA1c
    }
}