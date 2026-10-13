package com.diabetescdss.controller;

import com.diabetescdss.dto.request.PredictionRequest;
import com.diabetescdss.dto.response.ComparisonResponse;
import com.diabetescdss.dto.response.PredictionResponse;
import com.diabetescdss.security.CustomUserDetails;
import com.diabetescdss.service.PredictionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
public class PredictionController {

    private final PredictionService predictionService;

    @PostMapping
    public ResponseEntity<PredictionResponse> create(@AuthenticationPrincipal CustomUserDetails user,
                                                     @Valid @RequestBody PredictionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(predictionService.createPrediction(user.getUser().getId(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PredictionResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(predictionService.getPrediction(id));
    }

    @GetMapping
    public ResponseEntity<Page<PredictionResponse>> history(@AuthenticationPrincipal CustomUserDetails user,
                                                            Pageable pageable) {
        return ResponseEntity.ok(predictionService.getPredictionHistory(user.getUser().getId(), pageable));
    }

    @PostMapping("/compare")
    public ResponseEntity<ComparisonResponse> compare(@AuthenticationPrincipal CustomUserDetails user,
                                                      @RequestParam Long id1,
                                                      @RequestParam Long id2) {
        return ResponseEntity.ok(predictionService.comparePredictions(user.getUser().getId(), id1, id2));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal CustomUserDetails user,
                                       @PathVariable Long id) {
        predictionService.deletePrediction(user.getUser().getId(), id);
        return ResponseEntity.noContent().build();
    }
}