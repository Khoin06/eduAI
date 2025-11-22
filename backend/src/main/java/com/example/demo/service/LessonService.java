package com.example.demo.service;

import com.example.demo.model.Lesson;
import com.example.demo.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

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

    // Tạo bài học mới
    public Lesson saveLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    // Cập nhật bài học
    public Lesson updateLesson(Long id, Lesson updatedLesson) {
        Optional<Lesson> optionalLesson = lessonRepository.findById(id);
        if (optionalLesson.isPresent()) {
            Lesson lesson = optionalLesson.get();
            lesson.setTitle(updatedLesson.getTitle());
            lesson.setContent(updatedLesson.getContent());
            lesson.setDuration(updatedLesson.getDuration());
            lesson.setVideoUrl(updatedLesson.getVideoUrl());
            lesson.setOrderIndex(updatedLesson.getOrderIndex());
            if (updatedLesson.getCourse() != null)
                lesson.setCourse(updatedLesson.getCourse());
            return lessonRepository.save(lesson);
        }
        return null;
    }

    // Xóa bài học
    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }

    // Lấy tất cả bài học (admin)
    public List<Lesson> getAllLessons() {
        return lessonRepository.findAll();
    }
}