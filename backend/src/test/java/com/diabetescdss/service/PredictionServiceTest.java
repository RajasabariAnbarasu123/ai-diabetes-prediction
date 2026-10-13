package com.diabetescdss.service;

import com.diabetescdss.dto.request.PredictionRequest;
import com.diabetescdss.dto.response.PredictionResponse;
import com.diabetescdss.exception.ResourceNotFoundException;
import com.diabetescdss.mapper.PredictionMapper;
import com.diabetescdss.model.Prediction;
import com.diabetescdss.model.User;
import com.diabetescdss.repository.PredictionRepository;
import com.diabetescdss.repository.UserRepository;
import com.diabetescdss.service.impl.PredictionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PredictionServiceTest {

    @Mock private PredictionRepository predictionRepository;
    @Mock private UserRepository userRepository;
    @Mock private PredictionMapper predictionMapper;
    @Mock private GeminiAiService geminiAiService;
    @Mock private ActivityLogService activityLogService;

    @InjectMocks
    private PredictionServiceImpl predictionService;

    private User testUser;
    private Prediction testPrediction;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("test@example.com").build();
        testPrediction = Prediction.builder()
                .id(1L)
                .user(testUser)
                .hba1c(7.2)
                .fastingBloodSugar(130)
                .build();
    }

    @Test
    void createPrediction_shouldSaveAndCallAI() {
        PredictionRequest request = new PredictionRequest();
        request.setName("Test");
        request.setAge(30);
        request.setHba1c(7.2);
        // set other required fields...

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(predictionMapper.toEntity(request)).thenReturn(Prediction.builder().build());
        when(predictionRepository.save(any(Prediction.class))).thenReturn(testPrediction);
        when(geminiAiService.generatePredictionResult(any(Prediction.class))).thenReturn(testPrediction);
        when(predictionMapper.toResponse(testPrediction)).thenReturn(new PredictionResponse());

        PredictionResponse response = predictionService.createPrediction(1L, request);

        assertNotNull(response);
        verify(geminiAiService).generatePredictionResult(any(Prediction.class));
        verify(predictionRepository, times(2)).save(any(Prediction.class)); // initial save + after AI enrichment
    }

    @Test
    void getPrediction_shouldThrow_whenNotFound() {
        when(predictionRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> predictionService.getPrediction(99L));
    }

    @Test
    void getPredictionHistory_shouldReturnPage() {
        PageRequest pageable = PageRequest.of(0, 10);
        Page<Prediction> page = new PageImpl<>(List.of(testPrediction));
        when(predictionRepository.findByUserId(1L, pageable)).thenReturn(page);
        when(predictionMapper.toResponse(testPrediction)).thenReturn(PredictionResponse.builder().id(1L).hba1c(7.2).build());

        Page<PredictionResponse> result = predictionService.getPredictionHistory(1L, pageable);

        assertEquals(1, result.getTotalElements());
        assertEquals(7.2, result.getContent().get(0).getHba1c());
    }
}