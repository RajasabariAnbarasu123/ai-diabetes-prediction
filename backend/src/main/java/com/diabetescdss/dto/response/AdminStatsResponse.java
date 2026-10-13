package com.diabetescdss.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long disabledUsers;
    private long totalPredictions;
    private long totalReports;
    private long aiRequests;
    private long storageMB;

    private long highRiskCount;
    private long moderateRiskCount;
    private long lowRiskCount;

    private java.util.List<MonthlyTrend> monthlyTrends;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MonthlyTrend {
        private String month;
        private long count;
    }
}