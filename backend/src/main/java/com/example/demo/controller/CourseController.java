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

    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }
    @GetMapping("/unselected")
public ResponseEntity<?> getUnselectedCourses(@RequestParam Long userId) {
    try {
        System.out.println("📩 Nhận request lấy khóa học chưa chọn, userId = " + userId);
        var list = courseService.getUnselectedCourses(userId);
        System.out.println("✅ Tìm thấy " + list.size() + " khóa học chưa chọn");
        return ResponseEntity.ok(list);
    } catch (Exception e) {
        e.printStackTrace(); // In ra stacktrace để thấy lỗi thật
        return ResponseEntity.badRequest().body(Map.of(
            "error", e.getMessage()
        ));
    }
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



}
