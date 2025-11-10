// src/main/java/com/example/demo/service/AuthService.java
package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtTokenProvider jwtProvider;

    // ĐĂNG KÝ
    public String register(User user) {
        if (userRepo.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username đã tồn tại!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepo.save(user);
       return jwtProvider.generateToken(user.getUsername(), user.getRole());
    }


    // ĐĂNG NHẬP
    public String login(String username, String password) {
        User user = userRepo.findByUsername(username);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Sai tài khoản hoặc mật khẩu!");
        }
       return jwtProvider.generateToken(username, user.getRole());

    }
}