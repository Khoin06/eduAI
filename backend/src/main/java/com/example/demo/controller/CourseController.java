package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.model.Lesson;
import com.example.demo.model.UserCourse;
import com.example.demo.repository.LessonRepository;
import com.example.demo.service.CourseService;
import com.example.demo.service.UserCourseService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class CourseController {
    @Autowired
    private CourseService courseService;
    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private UserCourseService userCourseService;

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
    @GetMapping("/my-courses/{userId}")
    public List<Course> getMyCourses(@PathVariable Long userId) {
        List<Course> courses = courseService.getCoursesByUserId(userId);
        System.out.println(">>> UserID: " + userId + " - Courses found: " + courses.size());
        return courses;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return course != null ? ResponseEntity.ok(course) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{courseId}/lessons")
    public ResponseEntity<List<Lesson>> getLessons(@PathVariable Long courseId) {
        try {
            List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Course updated = courseService.updateCourse(id, course);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }

    // CourseController.java
    @PostMapping("/user-courses/batch")
    public ResponseEntity<?> addBatch(@RequestBody List<UserCourse> list) {
        userCourseService.addBatch(list);
        return ResponseEntity.ok("Thêm thành công!");
    }

    @DeleteMapping("/user-courses")
    public ResponseEntity<?> remove(@RequestParam Long userId, @RequestParam Long courseId) {
        userCourseService.remove(userId, courseId);
        return ResponseEntity.ok().build();
    }

}
