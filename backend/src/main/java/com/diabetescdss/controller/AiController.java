package com.diabetescdss.controller;

import com.diabetescdss.dto.request.AiChatRequest;
import com.diabetescdss.dto.request.DietRequest;
import com.diabetescdss.dto.response.*;
import com.diabetescdss.security.CustomUserDetails;
import com.diabetescdss.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiChatService aiChatService;
    private final DietService dietService;
    private final ExerciseService exerciseService;
    private final HealthTipService healthTipService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@AuthenticationPrincipal CustomUserDetails user,
                                               @Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(aiChatService.processMessage(user.getUser().getId(), request.getMessage()));
    }

    @GetMapping("/chat/history")
    public ResponseEntity<java.util.List<com.diabetescdss.model.AiChatHistory>> chatHistory(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(aiChatService.getChatHistory(user.getUser().getId()));
    }

    @GetMapping("/diet")
    public ResponseEntity<DietPlanResponse> diet(@AuthenticationPrincipal CustomUserDetails user,
                                                  @ModelAttribute DietRequest request) {
        return ResponseEntity.ok(dietService.generateDietPlan(user.getUser().getId(), request));
    }

    @GetMapping("/exercise")
    public ResponseEntity<ExercisePlanResponse> exercise(@AuthenticationPrincipal CustomUserDetails user) {
        return ResponseEntity.ok(exerciseService.generateExercisePlan(user.getUser().getId()));
    }

    @GetMapping("/tip")
    public ResponseEntity<HealthTipResponse> dailyTip() {
        return ResponseEntity.ok(healthTipService.getDailyTip());
    }
}