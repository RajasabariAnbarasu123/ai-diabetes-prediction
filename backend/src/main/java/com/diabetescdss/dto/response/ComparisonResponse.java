package com.diabetescdss.dto.response;

import lombok.*;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComparisonResponse {
    private PredictionBrief previous;
    private PredictionBrief current;
    private Map<String, Double> differences; // key: metric name, value: difference
    private String explanation;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PredictionBrief {
        private Long id;
        private String date;
        private Map<String, Object> values; // e.g., "hba1c": 7.2, "bmi": 26.1, etc.
    }
}