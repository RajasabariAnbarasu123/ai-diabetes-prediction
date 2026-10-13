package com.diabetescdss.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "medications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Medication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private String medicineName;
    private String dose;
    private boolean morning;
    private boolean afternoon;
    private boolean night;

    @Column(name = "morning_time")
    @Builder.Default
    private String morningTime = "08:00";

    @Column(name = "afternoon_time")
    @Builder.Default
    private String afternoonTime = "13:00";

    @Column(name = "night_time")
    @Builder.Default
    private String nightTime = "20:00";

    @Column(name = "app_notification")
    @Builder.Default
    private Boolean appNotification = true;

    @Column(name = "email_notification")
    @Builder.Default
    private Boolean emailNotification = true;

    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public String getMorningTime() {
        return morningTime != null ? morningTime : "08:00";
    }

    public String getAfternoonTime() {
        return afternoonTime != null ? afternoonTime : "13:00";
    }

    public String getNightTime() {
        return nightTime != null ? nightTime : "20:00";
    }

    public boolean isAppNotification() {
        return appNotification != null ? appNotification : true;
    }

    public boolean isEmailNotification() {
        return emailNotification != null ? emailNotification : true;
    }
}