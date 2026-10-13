package com.diabetescdss.dto.response;

import com.diabetescdss.enums.DiabetesStage;
import com.diabetescdss.enums.RiskLevel;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PredictionResponse {
    private Long id;
    private LocalDateTime createdAt;

    // Personal info
    private String name;
    private int age;
    private String gender;
    private double height;
    private double weight;
    private double bmi;

    // Medical details
    private double fastingBloodSugar;
    private double randomBloodSugar;
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
    private double dailyWaterIntake;
    private double sleepHours;
    private String dietType;
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

    // AI results
    private RiskLevel diabetesRisk;
    private DiabetesStage diabetesStage;
    private double confidenceScore;
    private String explanation;
    private String riskFactors;
    private String clinicalSummary;
    private String personalizedDiet;
    private String exercisePlan;
    private String lifestyleChanges;
    private String foodsToEat;
    private String foodsToAvoid;
    private String medicationReminders;
    private String warningSigns;
    private String whenToConsultDoctor;
}