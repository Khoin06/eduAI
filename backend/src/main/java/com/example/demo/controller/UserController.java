package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserCourseRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200") // ✅ cho phép Angular truy cập
public class UserController {

    @Autowired
    private UserRepository userRepository;
@Autowired
private UserCourseRepository userCourseRepository;
    // 🔹 Lấy toàn bộ danh sách user (chỉ ADMIN)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 🔹 Xóa user (chỉ ADMIN)

@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
@Transactional
public ResponseEntity<?> deleteUser(@PathVariable Long id) {
    // 🔹 1. Xóa tất cả user_courses trước
    userCourseRepository.deleteByUserId(id);

    // 🔹 2. Sau đó mới xóa user
    userRepository.deleteById(id);

    return ResponseEntity.ok(Map.of("message", "Đã xóa người dùng và dữ liệu liên quan"));
}

}
