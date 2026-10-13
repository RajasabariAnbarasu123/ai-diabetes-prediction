package com.diabetescdss.service.impl;

import com.diabetescdss.dto.response.ExercisePlanResponse;
import com.diabetescdss.service.ExerciseService;
import com.diabetescdss.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final GeminiAiService geminiAiService;

    @Override
    public ExercisePlanResponse generateExercisePlan(Long userId) {
        return geminiAiService.generateExercisePlan(userId);
    }
}