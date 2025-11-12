package com.example.demo.controller;

import com.example.demo.model.Lesson;
import com.example.demo.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    // 🔹 STUDENT + ADMIN: xem tất cả bài học của khóa học
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public List<Lesson> getLessonsByCourse(@PathVariable Long courseId) {
        return lessonService.findByCourseId(courseId);
    }

    // 🔹 STUDENT + ADMIN: xem chi tiết 1 bài học
    @GetMapping("/{lessonId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long lessonId) {
        Lesson lesson = lessonService.findById(lessonId);
        return lesson != null ? ResponseEntity.ok(lesson) : ResponseEntity.notFound().build();
    }

    // 🔹 ADMIN: thêm bài học
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {
        Lesson savedLesson = lessonService.saveLesson(lesson);
        return ResponseEntity.ok(savedLesson);
    }

    // 🔹 ADMIN: cập nhật bài học
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long id, @RequestBody Lesson lesson) {
        Lesson updatedLesson = lessonService.updateLesson(id, lesson);
        return updatedLesson != null ? ResponseEntity.ok(updatedLesson) : ResponseEntity.notFound().build();
    }

    // 🔹 ADMIN: xóa bài học
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}
