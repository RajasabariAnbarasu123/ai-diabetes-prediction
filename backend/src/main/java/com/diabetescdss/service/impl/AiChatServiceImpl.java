package com.diabetescdss.service.impl;

import com.diabetescdss.dto.response.AiChatResponse;
import com.diabetescdss.model.AiChatHistory;
import com.diabetescdss.model.User;
import com.diabetescdss.repository.AiChatHistoryRepository;
import com.diabetescdss.repository.UserRepository;
import com.diabetescdss.service.AiChatService;
import com.diabetescdss.service.GeminiAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiChatServiceImpl implements AiChatService {

    private final AiChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;
    private final GeminiAiService geminiAiService;

    @Override
    @Transactional
    public AiChatResponse processMessage(Long userId, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch recent conversation for context
        List<AiChatHistory> history = chatHistoryRepository.findByUserIdOrderByTimestampAsc(userId);
        List<Map<String, String>> conv = history.stream()
                .map(h -> Map.of("role", h.getRole(), "content", h.getContent()))
                .collect(Collectors.toList());

        String reply = geminiAiService.chat(message, conv);

        // Save user message
        AiChatHistory userMsg = AiChatHistory.builder()
                .user(user)
                .role("user")
                .content(message)
                .timestamp(LocalDateTime.now())
                .build();
        chatHistoryRepository.save(userMsg);

        // Save assistant reply
        AiChatHistory assistantMsg = AiChatHistory.builder()
                .user(user)
                .role("assistant")
                .content(reply)
                .timestamp(LocalDateTime.now())
                .build();
        chatHistoryRepository.save(assistantMsg);

        return new AiChatResponse(reply, null);
    }

    @Override
    public List<AiChatHistory> getChatHistory(Long userId) {
        return chatHistoryRepository.findByUserIdOrderByTimestampAsc(userId);
    }
}