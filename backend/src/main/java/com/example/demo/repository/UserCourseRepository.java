package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.UserCourse;

public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
    void deleteByUserIdAndCourseId(Long userId, Long courseId);
}
