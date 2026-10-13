package com.diabetescdss.service;

import com.diabetescdss.dto.request.DietRequest;
import com.diabetescdss.dto.request.PredictionRequest;
import com.diabetescdss.dto.response.DietPlanResponse;
import com.diabetescdss.dto.response.ExercisePlanResponse;
import com.diabetescdss.dto.response.HealthTipResponse;
import com.diabetescdss.model.Prediction;

import java.util.Map;

public interface GeminiAiService {
    Prediction generatePredictionResult(Prediction prediction);
    String generateReportSummary(String extractedText);
    String chat(String message, java.util.List<Map<String, String>> conversationHistory);
    DietPlanResponse generateDietPlan(Long userId, DietRequest request);
    ExercisePlanResponse generateExercisePlan(Long userId);
    HealthTipResponse generateDailyTip();
    String generateComparisonExplanation(Map<String, Object> data);
    com.diabetescdss.model.ExtractedReportData parseExtractedReportData(String extractedText, com.diabetescdss.model.ExtractedReportData entity);
}