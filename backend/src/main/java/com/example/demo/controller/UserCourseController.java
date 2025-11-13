package com.example.demo.controller;

import com.example.demo.model.UserCourse;
import com.example.demo.service.UserCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-courses") // ✅ Base URL
@CrossOrigin(origins = "http://localhost:4200")
public class UserCourseController {

    @Autowired
    private UserCourseService userCourseService;

    // ✅ Đúng URL: /api/user-courses/batch
    @PostMapping("/batch")
    public ResponseEntity<?> addBatch(@RequestBody List<UserCourse> list) {
        userCourseService.addBatch(list);
        return ResponseEntity.ok(Map.of("message", "Thêm khóa học thành công!"));
    }

    // ✅ Đúng URL: /api/user-courses?userId=1&courseId=5
    @DeleteMapping
    public ResponseEntity<?> remove(@RequestParam Long userId, @RequestParam Long courseId) {
        userCourseService.remove(userId, courseId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa khóa học khỏi danh sách!"));
    }

    @PostMapping
    public ResponseEntity<?> enroll(@RequestBody UserCourse uc) {
        userCourseService.add(uc.getUserId(), uc.getCourseId());
        return ResponseEntity.ok(Map.of("message", "Ghi danh thành công!"));
    }
}
