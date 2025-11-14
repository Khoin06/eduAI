package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.QuizSubmitRequest;
import com.example.demo.model.LessonProgress;
import com.example.demo.service.LessonProgressService;
@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class LessonProgressController  {
    private final LessonProgressService progressService;


    public LessonProgressController(LessonProgressService progressService) {
        this.progressService = progressService;
    }

    @PostMapping("/submit")
    public LessonProgress submitQuiz(@RequestBody QuizSubmitRequest request) {
        return progressService.saveQuizResult(request);
    }
    @GetMapping("/check")
    public boolean checkPassed(
            @RequestParam Long userId,
            @RequestParam Long lessonId
    ) {
        return progressService.checkPassed(userId, lessonId);
    }
}
