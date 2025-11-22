package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.QuizSubmitRequest;
import com.example.demo.model.LessonProgress;
import com.example.demo.repository.LessonProgressRepository;
import com.example.demo.service.LessonProgressService;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class LessonProgressController {
    private final LessonProgressService progressService;
    private final LessonProgressRepository lessonProgressRepository;


    public LessonProgressController(LessonProgressService progressService,LessonProgressRepository lessonProgressRepository) {
        this.progressService = progressService;
        this.lessonProgressRepository = lessonProgressRepository;
    }

    @PostMapping("/submit")
    public LessonProgress submitQuiz(@RequestBody QuizSubmitRequest request) {
        return progressService.saveQuizResult(request);
    }

    @GetMapping("/check")
    public boolean checkPassed(
            @RequestParam Long userId,
            @RequestParam Long lessonId) {
        return progressService.checkPassed(userId, lessonId);
    }

    @GetMapping("/course/{courseId}/user/{userId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<Long> getPassedLessonCount(
            @PathVariable Long courseId,
            @PathVariable Long userId) {

        Long passedCount = lessonProgressRepository.countPassedLessonsByCourseAndUser(userId, courseId);
        return ResponseEntity.ok(passedCount);
    }
}
