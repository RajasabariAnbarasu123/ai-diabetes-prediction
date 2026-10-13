package com.diabetescdss.service.impl;

import com.diabetescdss.dto.request.PredictionRequest;
import com.diabetescdss.dto.response.ComparisonResponse;
import com.diabetescdss.dto.response.PredictionResponse;
import com.diabetescdss.enums.ActivityType;
import com.diabetescdss.exception.ResourceNotFoundException;
import com.diabetescdss.mapper.PredictionMapper;
import com.diabetescdss.model.Prediction;
import com.diabetescdss.model.User;
import com.diabetescdss.repository.PredictionRepository;
import com.diabetescdss.repository.UserRepository;
import com.diabetescdss.service.ActivityLogService;
import com.diabetescdss.service.GeminiAiService;
import com.diabetescdss.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PredictionServiceImpl implements PredictionService {

    private final PredictionRepository predictionRepository;
    private final UserRepository userRepository;
    private final PredictionMapper predictionMapper;
    private final GeminiAiService geminiAiService;
    private final ActivityLogService activityLogService;

    @Override
    @Transactional
    public PredictionResponse createPrediction(Long userId, PredictionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Prediction prediction = predictionMapper.toEntity(request);
        prediction.setUser(user);
        prediction.setCreatedAt(java.time.LocalDateTime.now());
        prediction.setName(user.getName());
        prediction.setAge(user.getAge() != null ? user.getAge() : (request.getAge() != null ? request.getAge() : 0));
        prediction.setGender(user.getGender() != null ? user.getGender() : (request.getGender() != null ? request.getGender() : "Other"));

        // Calculate and set BMI for prediction
        if (request.getHeight() > 0 && request.getWeight() > 0) {
            double heightM = request.getHeight() / 100.0;
            double calculatedBmi = request.getWeight() / (heightM * heightM);
            prediction.setBmi(calculatedBmi);
            
            // Also update User profile
            user.setHeight(request.getHeight());
            user.setWeight(request.getWeight());
            user.setBmi(calculatedBmi);
            userRepository.save(user);
        } else if (user.getHeight() != null && user.getHeight() > 0 && user.getWeight() != null && user.getWeight() > 0) {
            double heightM = user.getHeight() / 100.0;
            double calculatedBmi = user.getWeight() / (heightM * heightM);
            prediction.setBmi(calculatedBmi);
            prediction.setHeight(user.getHeight());
            prediction.setWeight(user.getWeight());
        }

        prediction = predictionRepository.save(prediction);

        // Call AI to analyze and populate results
        prediction = geminiAiService.generatePredictionResult(prediction);
        prediction = predictionRepository.save(prediction);

        // Log activity in database
        activityLogService.logActivity(userId, ActivityType.PREDICTION, "127.0.0.1", "Web Client", "Browser");

        return predictionMapper.toResponse(prediction);
    }

    @Override
    public PredictionResponse getPrediction(Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prediction not found"));
        return predictionMapper.toResponse(prediction);
    }

    @Override
    public Page<PredictionResponse> getPredictionHistory(Long userId, Pageable pageable) {
        return predictionRepository.findByUserId(userId, pageable)
                .map(predictionMapper::toResponse);
    }

    @Override
    @Transactional
    public ComparisonResponse comparePredictions(Long userId, Long id1, Long id2) {
        Prediction p1 = predictionRepository.findById(id1)
                .orElseThrow(() -> new ResourceNotFoundException("Prediction 1 not found"));
        Prediction p2 = predictionRepository.findById(id2)
                .orElseThrow(() -> new ResourceNotFoundException("Prediction 2 not found"));

        if (!p1.getUser().getId().equals(userId) || !p2.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Prediction not found");
        }

        // Build rich metric maps for each prediction
        java.util.Map<String, Object> vals1 = new java.util.LinkedHashMap<>();
        vals1.put("hba1c", p1.getHba1c());
        vals1.put("fastingBloodSugar", p1.getFastingBloodSugar());
        vals1.put("randomBloodSugar", p1.getRandomBloodSugar());
        vals1.put("bmi", p1.getBmi());
        vals1.put("cholesterol", p1.getCholesterol());
        vals1.put("hdl", p1.getHdl());
        vals1.put("ldl", p1.getLdl());
        vals1.put("triglycerides", p1.getTriglycerides());
        vals1.put("diabetesRisk", p1.getDiabetesRisk() != null ? p1.getDiabetesRisk().name() : "N/A");
        vals1.put("diabetesStage", p1.getDiabetesStage() != null ? p1.getDiabetesStage().name() : "N/A");
        vals1.put("confidenceScore", p1.getConfidenceScore());

        java.util.Map<String, Object> vals2 = new java.util.LinkedHashMap<>();
        vals2.put("hba1c", p2.getHba1c());
        vals2.put("fastingBloodSugar", p2.getFastingBloodSugar());
        vals2.put("randomBloodSugar", p2.getRandomBloodSugar());
        vals2.put("bmi", p2.getBmi());
        vals2.put("cholesterol", p2.getCholesterol());
        vals2.put("hdl", p2.getHdl());
        vals2.put("ldl", p2.getLdl());
        vals2.put("triglycerides", p2.getTriglycerides());
        vals2.put("diabetesRisk", p2.getDiabetesRisk() != null ? p2.getDiabetesRisk().name() : "N/A");
        vals2.put("diabetesStage", p2.getDiabetesStage() != null ? p2.getDiabetesStage().name() : "N/A");
        vals2.put("confidenceScore", p2.getConfidenceScore());

        // Numeric differences (p2 - p1)
        java.util.Map<String, Double> differences = new java.util.LinkedHashMap<>();
        differences.put("hba1c", p2.getHba1c() - p1.getHba1c());
        differences.put("fastingBloodSugar", p2.getFastingBloodSugar() - p1.getFastingBloodSugar());
        differences.put("randomBloodSugar", p2.getRandomBloodSugar() - p1.getRandomBloodSugar());
        differences.put("bmi", p2.getBmi() - p1.getBmi());
        differences.put("cholesterol", p2.getCholesterol() - p1.getCholesterol());
        differences.put("hdl", p2.getHdl() - p1.getHdl());
        differences.put("ldl", p2.getLdl() - p1.getLdl());
        differences.put("triglycerides", p2.getTriglycerides() - p1.getTriglycerides());

        ComparisonResponse.PredictionBrief prev = ComparisonResponse.PredictionBrief.builder()
                .id(p1.getId())
                .date(p1.getCreatedAt().toString())
                .values(vals1)
                .build();

        ComparisonResponse.PredictionBrief curr = ComparisonResponse.PredictionBrief.builder()
                .id(p2.getId())
                .date(p2.getCreatedAt().toString())
                .values(vals2)
                .build();

        String explanation = geminiAiService.generateComparisonExplanation(
                java.util.Map.of("previous", prev, "current", curr, "differences", differences)
        );

        return ComparisonResponse.builder()
                .previous(prev)
                .current(curr)
                .differences(differences)
                .explanation(explanation)
                .build();
    }

    @Override
    @Transactional
    public void deletePrediction(Long userId, Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prediction not found"));
        if (!prediction.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Prediction not found");
        }
        predictionRepository.delete(prediction);
    }
}