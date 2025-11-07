package com.example.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

@Autowired private UserRepository userRepo;
@PostMapping("/register")
public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
    String username = body.get("username");
    String password = body.get("password");

    Map<String, Object> response = new HashMap<>();

    if (username == null || password == null || userRepo.existsByUsername(username)) {
        response.put("success", false);
        response.put("error", "Username đã tồn tại hoặc thiếu!");
        return ResponseEntity.badRequest().body(response);
    }

    User user = new User();
    user.setUsername(username);
    user.setPassword(password);
    userRepo.save(user);

    response.put("success", true);
    response.put("message", "Đăng ký thành công!");
    response.put("username", username);
    return ResponseEntity.ok(response);
}


@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginUser) {
User user = userRepo.findByUsername(loginUser.getUsername());
    
    if (user == null || !user.getPassword().equals(loginUser.getPassword())) {
        return ResponseEntity.badRequest().body("Sai thông tin!");
    }

    // DÙNG HashMap ĐỂ TRẢ DỮ LIỆU
    Map<String, Object> response = new HashMap<>();
    response.put("id", user.getId());
    response.put("username", user.getUsername());

    return ResponseEntity.ok(response);
}
}
