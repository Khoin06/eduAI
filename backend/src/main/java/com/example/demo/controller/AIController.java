package com.example.demo.controller;

import com.example.demo.model.Lesson;
import com.example.demo.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpHeaders;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:4200")
public class AIController {

    private final LessonRepository lessonRepository;
    private final WebClient webClient;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public AIController(LessonRepository lessonRepository, WebClient.Builder webClientBuilder) {
        this.lessonRepository = lessonRepository;
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
    }

    @GetMapping("/lesson-assistant/{lessonId}")
    public ResponseEntity<?> generateLessonAssistant(@PathVariable Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId).orElse(null);
        if (lesson == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy bài học!"));

        try {
            String prompt = """
                    Bạn là trợ giảng lập trình. Tạo quiz trắc nghiệm ngắn và nội dung gợi ý chat từ nội dung sau:
                    ---
                    %s
                    ---
                    Trả về JSON theo mẫu:
                    {
                      "quiz": [
                        { "question": "...", "options": ["A","B","C","D"], "answer": "B" }
                      ],
                      "suggestions": ["Tóm tắt phần này", "Cho ví dụ thêm", "Giải thích sâu hơn về ..."]
                    }
                    """.formatted(lesson.getContent());

            WebClient webClient = WebClient.create("https://generativelanguage.googleapis.com/v1");
            var response = webClient.post()
                    .uri("/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(Map.of("contents", new Object[] {
                            Map.of("parts", new Object[] { Map.of("text", prompt) })
                    }))
                    .retrieve()
                    .onStatus(
                            status -> status.isError(),
                            clientResponse -> clientResponse.bodyToMono(String.class)
                                    .map(body -> new RuntimeException("Gemini API Error: " + body)))
                    .bodyToMono(Map.class)
                    .block();

            System.out.println("✅ Gemini response: " + response);

            return ResponseEntity.ok(Map.of("aiResponse", response));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chatWithGemini(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");

        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Tin nhắn trống!"));
        }

        WebClient client = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of(
                        "parts", List.of(Map.of("text", message)))));

        try {
            // ✅ Gọi Gemini
            Map response = client.post()
                    .uri(uriBuilder -> uriBuilder.queryParam("key", geminiApiKey).build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // ✅ Lấy text từ kết quả trả về
            String reply = "Không có phản hồi.";
            try {
                Map candidate = (Map) ((List) response.get("candidates")).get(0);
                Map content = (Map) candidate.get("content");
                List parts = (List) content.get("parts");
                Map part = (Map) parts.get(0);
                reply = (String) part.get("text");
            } catch (Exception ignored) {
            }

            return ResponseEntity.ok(Map.of("reply", reply));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

}
