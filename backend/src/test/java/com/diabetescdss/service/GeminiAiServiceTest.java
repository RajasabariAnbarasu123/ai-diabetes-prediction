package com.diabetescdss.service;

import com.diabetescdss.dto.response.DietPlanResponse;
import com.diabetescdss.dto.response.ExercisePlanResponse;
import com.diabetescdss.dto.response.HealthTipResponse;
import com.diabetescdss.model.Prediction;
import com.diabetescdss.repository.PredictionRepository;
import com.diabetescdss.service.impl.GeminiAiServiceImpl;
import com.diabetescdss.util.PromptBuilder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
class GeminiAiServiceTest {

    @Mock
    private PromptBuilder promptBuilder;

    @Mock
    private ObjectMapper objectMapper;

    @Mock
    private PredictionRepository predictionRepository;

    @InjectMocks
    private GeminiAiServiceImpl geminiAiService;

    @BeforeEach
    void setUp() {
        lenient().when(promptBuilder.buildPredictionPrompt(any())).thenReturn("prediction-prompt");
        lenient().when(promptBuilder.buildReportSummaryPrompt(any())).thenReturn("report-prompt");
        lenient().when(promptBuilder.buildChatPrompt(any(), any())).thenReturn("chat-prompt");
        lenient().when(promptBuilder.buildDailyTipPrompt()).thenReturn("tip-prompt");
        lenient().when(predictionRepository.findByUserId(any(), any())).thenReturn(new PageImpl<>(List.of()));
    }

    @Test
    void generatePredictionResult_shouldReturnUpdatedPrediction() {
        Prediction prediction = Prediction.builder()
                .hba1c(7.8)
                .fastingBloodSugar(145)
                .build();

        Prediction result = geminiAiService.generatePredictionResult(prediction);

        assertNotNull(result);
        assertEquals(7.8, result.getHba1c());
    }

    @Test
    void generateReportSummary_shouldReturnPlaceholderString() {
        String summary = geminiAiService.generateReportSummary("HbA1c 8.4, LDL 150");
        assertNotNull(summary);
        assertFalse(summary.isEmpty());
    }

    @Test
    void chat_shouldReturnEchoLikeString() {
        String reply = geminiAiService.chat("Hello", null);
        assertTrue(reply.contains("Hello"));
    }

    @Test
    void generateDietPlan_shouldReturnEmptyDietPlan() {
        DietPlanResponse response = geminiAiService.generateDietPlan(1L, null);
        assertNotNull(response);
        // The placeholder returns an empty object, not null.
    }

    @Test
    void generateExercisePlan_shouldReturnEmptyPlan() {
        ExercisePlanResponse response = geminiAiService.generateExercisePlan(1L);
        assertNotNull(response);
    }

    @Test
    void generateDailyTip_shouldReturnNonEmptyTip() {
        HealthTipResponse tip = geminiAiService.generateDailyTip();
        assertNotNull(tip);
        assertTrue(tip.getTip().contains("Stay hydrated"));
    }
}