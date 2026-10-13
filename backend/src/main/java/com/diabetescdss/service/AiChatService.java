package com.diabetescdss.service;

import com.diabetescdss.dto.response.AiChatResponse;
import com.diabetescdss.model.AiChatHistory;

import java.util.List;

public interface AiChatService {
    AiChatResponse processMessage(Long userId, String message);
    List<AiChatHistory> getChatHistory(Long userId);
}