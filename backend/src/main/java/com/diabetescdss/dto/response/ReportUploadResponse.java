package com.diabetescdss.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportUploadResponse {
    private ReportDto report;
    private ExtractedDataDto extractedData;
    private String aiSummary;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReportDto {
        private Long id;
        private String fileName;
        private LocalDateTime uploadDate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExtractedDataDto {
        private Long id;
        private String extractedText;
        private Double hba1c;
        private Double fastingBloodSugar;
        private Double randomBloodSugar;
        private Double bloodSugar;
        private String bloodPressure;
        private Double bloodPressureSystolic;
        private Double bloodPressureDiastolic;
        private Double cholesterol;
        private Double hdl;
        private Double ldl;
        private Double triglycerides;
        private Double bmi;
        private Double weight;
        private Integer age;
        private String medications;
        private String labValues;
    }
}