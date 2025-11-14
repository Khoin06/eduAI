package com.example.demo.service;

import com.example.demo.dto.QuizSubmitRequest;
import com.example.demo.model.Lesson;
import com.example.demo.model.LessonProgress;
import com.example.demo.model.User;
import com.example.demo.repository.LessonProgressRepository;
import com.example.demo.repository.LessonRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class LessonProgressService {

    private final LessonProgressRepository progressRepo;
    private final UserRepository userRepo;
    private final LessonRepository lessonRepo;

    public LessonProgressService(LessonProgressRepository progressRepo, UserRepository userRepo, LessonRepository lessonRepo) {
        this.progressRepo = progressRepo;
        this.userRepo = userRepo;
        this.lessonRepo = lessonRepo;
    }

    public LessonProgress saveQuizResult(QuizSubmitRequest req) {

        User user = userRepo.findById(req.userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Lesson lesson = lessonRepo.findById(req.lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        LessonProgress progress = progressRepo.findByUserIdAndLessonId(req.userId, req.lessonId)
                .orElse(new LessonProgress());

        progress.setUser(user);
        progress.setLesson(lesson);
        progress.setScore(req.score);
        progress.setPassed(req.score >= 8);

        return progressRepo.save(progress);
    }

public boolean checkPassed(Long userId, Long lessonId) {
    return progressRepo.findByUserIdAndLessonId(userId, lessonId)
            .map(LessonProgress::isPassed)
            .orElse(false);
}

}
