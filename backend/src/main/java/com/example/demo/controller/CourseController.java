package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.model.Lesson;
import com.example.demo.repository.LessonRepository;
import com.example.demo.repository.UserCourseRepository;
import com.example.demo.service.CourseService;
import com.example.demo.service.UserCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        @Autowired
    private UserCourseRepository userCourseRepository;

    // ✅ Student hoặc Admin đều có thể xem
    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/unselected")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<?> getUnselectedCourses(@RequestParam Long userId) {
        try {
            var list = courseService.getUnselectedCourses(userId);
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-courses/{userId}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public List<Course> getMyCourses(@PathVariable Long userId) {
        return courseService.getCoursesByUserId(userId);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Course course = courseService.getCourseById(id);
        return course != null ? ResponseEntity.ok(course) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{courseId}/lessons")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<List<Lesson>> getLessons(@PathVariable Long courseId) {
        try {
            List<Lesson> lessons = lessonRepository.findByCourseId(courseId);
            return ResponseEntity.ok(lessons);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // ✅ Chỉ Admin được thêm khóa học
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Course createCourse(@RequestBody Course course) {
        return courseService.createCourse(course);
    }

    // ✅ Chỉ Admin được sửa khóa học
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Course updated = courseService.updateCourse(id, course);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    // ✅ Chỉ Admin được xóa khóa học
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        userCourseRepository.deleteByCourseId(id);
        lessonRepository.deleteByCourseId(id);
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }
}
