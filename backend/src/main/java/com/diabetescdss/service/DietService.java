package com.diabetescdss.service;

import com.diabetescdss.dto.request.DietRequest;
import com.diabetescdss.dto.response.DietPlanResponse;

public interface DietService {
    DietPlanResponse generateDietPlan(Long userId, DietRequest request);
}