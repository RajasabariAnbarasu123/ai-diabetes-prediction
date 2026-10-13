package com.diabetescdss.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "extracted_report_data")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExtractedReportData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "report_id", nullable = false)
    private MedicalReport report;

    @Column(columnDefinition = "TEXT")
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