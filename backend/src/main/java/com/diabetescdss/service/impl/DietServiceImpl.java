package com.diabetescdss.service.impl;

import com.diabetescdss.dto.request.DietRequest;
import com.diabetescdss.dto.response.DietPlanResponse;
import com.diabetescdss.service.DietService;
import com.diabetescdss.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DietServiceImpl implements DietService {

    private final GeminiAiService geminiAiService;

    @Override
    public DietPlanResponse generateDietPlan(Long userId, DietRequest request) {
        return geminiAiService.generateDietPlan(userId, request);
    }
}