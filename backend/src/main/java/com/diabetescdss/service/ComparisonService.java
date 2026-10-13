package com.diabetescdss.service;

import com.diabetescdss.dto.response.ComparisonResponse;

public interface ComparisonService {
    ComparisonResponse comparePredictions(Long userId, Long id1, Long id2);
}