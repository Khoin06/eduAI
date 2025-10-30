package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.model.User;

import jakarta.validation.Valid;

public class AuthController {
    @PostMapping("/auth/register")
public ResponseEntity<?> register(@Valid @RequestBody AuthRequest request) {
    User user = authService.register(request);
    String token = jwtTokenProvider.generateToken(user);
    return ResponseEntity.ok(new AuthResponse(token));
}

@PostMapping("/auth/login")
public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
    String token = authService.login(request);
    return ResponseEntity.ok(new AuthResponse(token));
}
}
