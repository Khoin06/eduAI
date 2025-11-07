package com.example.demo.service;

import com.example.demo.model.Quiz;
import com.example.demo.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    public Quiz findByLessonId(Long lessonId) {
        return quizRepository.findByLessonId(lessonId).orElse(null);
    }

    public Quiz findById(Long id) {
        return quizRepository.findById(id).orElse(null);
    }
}
