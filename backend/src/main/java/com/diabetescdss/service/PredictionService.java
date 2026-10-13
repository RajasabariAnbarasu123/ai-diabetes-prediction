package com.diabetescdss.service;

import com.diabetescdss.dto.request.PredictionRequest;
import com.diabetescdss.dto.response.ComparisonResponse;
import com.diabetescdss.dto.response.PredictionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PredictionService {
    PredictionResponse createPrediction(Long userId, PredictionRequest request);
    PredictionResponse getPrediction(Long id);
    Page<PredictionResponse> getPredictionHistory(Long userId, Pageable pageable);
    ComparisonResponse comparePredictions(Long userId, Long id1, Long id2);
    void deletePrediction(Long userId, Long id);
}