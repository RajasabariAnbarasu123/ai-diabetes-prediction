package com.diabetescdss.service.impl;

import com.diabetescdss.dto.response.ComparisonResponse;
import com.diabetescdss.exception.ResourceNotFoundException;
import com.diabetescdss.model.Prediction;
import com.diabetescdss.repository.PredictionRepository;
import com.diabetescdss.service.ComparisonService;
import com.diabetescdss.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ComparisonServiceImpl implements ComparisonService {

    private final PredictionRepository predictionRepository;
    private final GeminiAiService geminiAiService;

    @Override
    public ComparisonResponse comparePredictions(Long userId, Long id1, Long id2) {
        Prediction p1 = predictionRepository.findById(id1)
                .orElseThrow(() -> new ResourceNotFoundException("Prediction 1 not found"));
        Prediction p2 = predictionRepository.findById(id2)
                .orElseThrow(() -> new ResourceNotFoundException("Prediction 2 not found"));

        ComparisonResponse.PredictionBrief prev = mapToBrief(p1);
        ComparisonResponse.PredictionBrief curr = mapToBrief(p2);

        Map<String, Double> differences = new HashMap<>();
        differences.put("hba1c", p2.getHba1c() - p1.getHba1c());
        differences.put("bmi", p2.getBmi() - p1.getBmi());

        String explanation = geminiAiService.generateComparisonExplanation(Map.of(
                "previous", prev, "current", curr
        ));

        return ComparisonResponse.builder()
                .previous(prev)
                .current(curr)
                .differences(differences)
                .explanation(explanation)
                .build();
    }

    private ComparisonResponse.PredictionBrief mapToBrief(Prediction p) {
        Map<String, Object> values = new HashMap<>();
        values.put("hba1c", p.getHba1c());
        values.put("bmi", p.getBmi());
        values.put("bloodSugar", p.getFastingBloodSugar());
        return ComparisonResponse.PredictionBrief.builder()
                .id(p.getId())
                .date(p.getCreatedAt().toString())
                .values(values)
                .build();
    }
}