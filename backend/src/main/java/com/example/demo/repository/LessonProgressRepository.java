package com.example.demo.repository;

import com.example.demo.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    @Query("SELECT lp FROM LessonProgress lp JOIN lp.lesson l " +
           "WHERE lp.user.id = :userId AND l.course.id = :courseId " +
           "ORDER BY l.orderIndex ASC")
    List<LessonProgress> findProgressByUserIdAndCourseId(
            @Param("userId") Long userId,
            @Param("courseId") Long courseId);
@Query("SELECT COUNT(lp) FROM LessonProgress lp " +
           "WHERE lp.user.id = :userId " +
           "AND lp.lesson.course.id = :courseId " +
           "AND lp.passed = true")
    Long countPassedLessonsByCourseAndUser(@Param("userId") Long userId, @Param("courseId") Long courseId);
}
