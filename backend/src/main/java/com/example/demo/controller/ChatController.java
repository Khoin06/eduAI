package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.dto.ChatRequest;
import com.example.demo.model.ChatMessage;
import com.example.demo.model.Lesson;
import com.example.demo.model.User;

public class ChatController {
    @PostMapping("/chat")
public ResponseEntity<ChatResponse> chat(
    @RequestBody ChatRequest request,
    @AuthenticationPrincipal User user) {

    Lesson lesson = lessonService.getById(request.getLessonId());
    String answer = openAiService.askQuestion(lesson.getContent(), request.getQuestion());

    ChatMessage msg = chatService.save(user, request.getQuestion(), answer);
    return ResponseEntity.ok(new ChatResponse(msg));
}
}
