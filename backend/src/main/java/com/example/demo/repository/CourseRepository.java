package com.example.demo.repository;


import com.example.demo.model.Course;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    @Query("SELECT c FROM Course c JOIN UserCourse uc ON c.id = uc.courseId WHERE uc.userId = :userId")
List<Course> findCoursesByUserId(@Param("userId") Long userId);
}
