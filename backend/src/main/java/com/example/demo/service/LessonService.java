package com.example.demo.service;


import com.example.demo.model.Lesson;
import com.example.demo.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    public List<Lesson> findByCourseId(Long courseId) {
        return lessonRepository.findByCourseId(courseId);
    }

    public Lesson findById(Long id) {
        return lessonRepository.findById(id).orElse(null);
    }
}