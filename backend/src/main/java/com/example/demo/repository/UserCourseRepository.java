package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.UserCourse;

public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
 Optional<UserCourse> findByUserIdAndCourseId(Long userId, Long courseId);
 void deleteByCourseId(Long courseId);
  void deleteByUserId(Long userId);
}
