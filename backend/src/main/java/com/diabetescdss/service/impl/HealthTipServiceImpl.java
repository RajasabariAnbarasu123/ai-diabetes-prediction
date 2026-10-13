package com.diabetescdss.service.impl;

import com.diabetescdss.dto.response.HealthTipResponse;
import com.diabetescdss.service.GeminiAiService;
import com.diabetescdss.service.HealthTipService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthTipServiceImpl implements HealthTipService {

    private final GeminiAiService geminiAiService;

    @Override
    public HealthTipResponse getDailyTip() {
        return geminiAiService.generateDailyTip();
    }
}