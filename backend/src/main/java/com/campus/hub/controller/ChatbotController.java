package com.campus.hub.controller;

import com.campus.hub.dto.MessageRequest;
import com.campus.hub.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/message")
    public ResponseEntity<Map<String, String>> sendMessage(@RequestBody MessageRequest request) {
        String response = chatbotService.getResponse(request.getMessage());
        return ResponseEntity.ok(Map.of("reply", response));
    }
}
