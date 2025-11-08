package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.UserCourse;
import com.example.demo.repository.UserCourseRepository;

@Service
public class UserCourseService {
    @Autowired
    private UserCourseRepository userCourseRepository;

    public void addBatch(List<UserCourse> list) {
        list.forEach(dto -> {
            UserCourse uc = new UserCourse();
            uc.setUserId(dto.getUserId());
            uc.setCourseId(dto.getCourseId());
            uc.setProgress(0);
            userCourseRepository.save(uc);
        });
    }

    public boolean remove(Long userId, Long courseId) {
        return userCourseRepository.findByUserIdAndCourseId(userId, courseId)
                .map(userCourse -> {
                    userCourseRepository.delete(userCourse);
                    return true;
                })
                .orElse(false);
    }
}