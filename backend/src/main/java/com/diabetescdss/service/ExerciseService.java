package com.diabetescdss.service;

import com.diabetescdss.dto.response.ExercisePlanResponse;

public interface ExerciseService {
    ExercisePlanResponse generateExercisePlan(Long userId);
}