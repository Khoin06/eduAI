package com.example.demo.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtTokenProvider;

import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

@Autowired private UserRepository userRepo;
@Autowired private JwtTokenProvider  jwtTokenProvider;
@Autowired 
private PasswordEncoder passwordEncoder;


@PostMapping("/register")
public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {

    String username = body.get("username");
    String password = body.get("password");

    if (username == null || password == null || userRepo.existsByUsername(username)) {
        return ResponseEntity.badRequest().body(Map.of("error", "Username đã tồn tại hoặc thiếu!"));
    }

    User user = new User();
    user.setUsername(username);

    // ✅ encode password trước khi lưu
    user.setPassword(passwordEncoder.encode(password));

    userRepo.save(user);

    return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Đăng ký thành công!",
            "username", username
    ));
}



@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginUser) {
    User user = userRepo.findByUsername(loginUser.getUsername());



System.out.println("LOGIN username=" + loginUser.getUsername());
System.out.println("RAW_PASS = " + loginUser.getPassword());
if (user != null) {
    System.out.println("DB_PASS  = " + user.getPassword());
    System.out.println("MATCH    = " + passwordEncoder.matches(loginUser.getPassword(), user.getPassword()));
} else {
    System.out.println("USER NOT FOUND!");
}

    if (user == null || !passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {
        return ResponseEntity.badRequest().body("Sai thông tin!");
    }
    // Generate token
    String token = jwtTokenProvider.generateToken(user.getUsername(), user.getRole());

    Map<String, Object> response = new HashMap<>();
    response.put("id", user.getId());
    response.put("username", user.getUsername());
    response.put("role", user.getRole());
    response.put("token", token);

    return ResponseEntity.ok(response);
}

}
