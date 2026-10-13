package com.diabetescdss.model;

import com.diabetescdss.enums.DiabetesStage;
import com.diabetescdss.enums.DietType;
import com.diabetescdss.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
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
    private double cholesterol;
    private double hdl;
    private double ldl;
    private double triglycerides;

    private boolean familyHistory;
    private boolean smoking;
    private boolean alcohol;
    private String physicalActivity;
    private double dailyWaterIntake;
    private double sleepHours;

    @Enumerated(EnumType.STRING)
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

    // AI results
    @Enumerated(EnumType.STRING)
    private RiskLevel diabetesRisk;
    @Enumerated(EnumType.STRING)
    private DiabetesStage diabetesStage;
    private double confidenceScore;

    @Column(length = 2000)
    private String explanation;
    @Column(length = 1000)
    private String riskFactors;
    @Column(length = 2000)
    private String clinicalSummary;
    @Column(length = 2000)
    private String personalizedDiet;
    @Column(length = 1000)
    private String exercisePlan;
    @Column(length = 1000)
    private String lifestyleChanges;
    @Column(length = 1000)
    private String foodsToEat;
    @Column(length = 1000)
    private String foodsToAvoid;
    @Column(length = 1000)
    private String medicationReminders;
    @Column(length = 1000)
    private String warningSigns;
    @Column(length = 1000)
    private String whenToConsultDoctor;
}