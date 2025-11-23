package com.example.demo.repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.model.UserCourse;

public interface UserCourseRepository extends JpaRepository<UserCourse, Long> {
 Optional<UserCourse> findByUserIdAndCourseId(Long userId, Long courseId);
 void deleteByCourseId(Long courseId);
  void deleteByUserId(Long userId);
  
    @Query(value = """
        SELECT c.title AS title, uc.progress AS progress
        FROM user_courses uc
        JOIN courses c ON c.id = uc.course_id
        WHERE uc.user_id = :userId
    """, nativeQuery = true)
    List<Map<String, Object>> getProgressByUser(@Param("userId") Long userId);
}
