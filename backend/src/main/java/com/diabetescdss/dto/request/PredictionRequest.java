package com.diabetescdss.dto.request;

import com.diabetescdss.enums.DietType;
import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionRequest {

    // Personal Information
    private String name;
    private Integer age;
    private String gender;

    @Min(value = 50, message = "Height must be at least 50 cm")
    @Max(value = 250, message = "Height must be at most 250 cm")
    private double height;

    @Min(value = 20, message = "Weight must be at least 20 kg")
    @Max(value = 300, message = "Weight must be at most 300 kg")
    private double weight;

    // BMI is auto-calculated, but we can include if frontend sends it
    private Double bmi;

    // Medical Details
    @Min(value = 0, message = "Fasting blood sugar cannot be negative")
    private double fastingBloodSugar;

    @Min(value = 0, message = "Random blood sugar cannot be negative")
    private double randomBloodSugar;

    @Min(value = 0, message = "HbA1c cannot be negative")
    @Max(value = 20, message = "HbA1c seems unrealistic")
    private double hba1c;

    private String bloodPressure;
    private Double cholesterol;
    private Double hdl;
    private Double ldl;
    private Double triglycerides;

    private boolean familyHistory;
    private boolean smoking;
    private boolean alcohol;

    private String physicalActivity;

    @Min(value = 0)
    private double dailyWaterIntake;

    @Min(value = 0)
    @Max(value = 24)
    private double sleepHours;

    @NotNull(message = "Diet type is required")
    private DietType dietType;

    private String stressLevel;
    private String existingDiseases;
    private String currentMedications;

    // Symptoms
    private boolean frequentUrination;
    private boolean increasedThirst;
    private boolean weightLoss;
    private boolean blurredVision;
    private boolean fatigue;
    private boolean slowWoundHealing;
    private boolean tinglingSensation;
    private boolean increasedHunger;
}