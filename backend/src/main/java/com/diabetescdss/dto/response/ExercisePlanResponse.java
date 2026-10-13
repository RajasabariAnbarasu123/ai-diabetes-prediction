package com.diabetescdss.dto.response;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExercisePlanResponse {
    private String generalAdvice;
    private String intensity;
    private Integer weeklyMinutes;
    private List<ExerciseActivity> activities;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExerciseActivity {
        private String name;
        private String type; // walking, running, yoga, cycling, swimming, strength, stretching, etc.
        private int duration; // minutes
        private String calories;
        private String frequency;
        private String intensity;
        private String description;
        private String benefit;
    }
}