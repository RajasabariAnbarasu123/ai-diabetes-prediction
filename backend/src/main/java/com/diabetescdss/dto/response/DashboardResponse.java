package com.diabetescdss.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private String currentRisk;
    private Double lastHbA1c;
    private Double currentBMI;
    private int healthScore;
    private int totalPredictions;
    private double improvementPercentage;
    private String healthTip;
    private String latestRecommendation;
}