package com.example.demo.service;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import com.example.demo.model.ChatMessage;

import lombok.RequiredArgsConstructor;
import lombok.Value;

@Service
@RequiredArgsConstructor
public class OpenAiService {

    // @Value("${openai.api.key}")
    // private String apiKey;

    // @Value("${openai.model}")
    // private String model;

    // private final OpenAiService openAiService;

    // @Bean
    // public OpenAiService openAiService() {
    //     return new OpenAiService(apiKey);
    // }

    // public String askQuestion(String lessonContent, String question) {
    //     String prompt = """
    //         Bạn là trợ giảng AI cho bài học sau:
    //         %s

    //         Học viên hỏi: %s
    //         Trả lời ngắn gọn, dễ hiểu, bằng tiếng Việt.
    //         """.formatted(lessonContent, question);

    //     ChatCompletionRequest request = ChatCompletionRequest.builder()
    //         .model(model)
    //         .messages(List.of(new ChatMessage("user", prompt)))
    //         .maxTokens(500)
    //         .build();

    //     return openAiService.createChatCompletion(request)
    //         .getChoices().get(0).getMessage().getContent();
    // }

    // public List<Quiz> generateQuiz(String lessonContent) {
    //     String prompt = """
    //         Tạo 5 câu hỏi trắc nghiệm từ nội dung sau.
    //         Mỗi câu: câu hỏi, 4 đáp án (A,B,C,D), đáp án đúng.
    //         Định dạng JSON:
    //         [{"question": "...", "options": ["A. ...", "B. ..."], "answer": "A"}]

    //         Nội dung bài học:
    //         %s
    //         """.formatted(lessonContent);

    //     // Gọi OpenAI...
    //     // Parse JSON → List<Quiz>
    // }
}