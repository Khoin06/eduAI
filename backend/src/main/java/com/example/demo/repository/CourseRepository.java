package com.example.demo.repository;


import com.example.demo.model.Course;
import com.example.demo.model.UserCourse;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query(value = """
        SELECT c.* 
        FROM courses c
        INNER JOIN user_courses uc ON uc.course_id = c.id
        WHERE uc.user_id = :userId
        """, nativeQuery = true)
    List<Course> findCoursesByUserId(@Param("userId") Long userId);

@Query("SELECT c FROM Course c WHERE c.id NOT IN " +
       "(SELECT uc.courseId FROM UserCourse uc WHERE uc.userId = :userId)")
List<Course> findCoursesNotSelectedByUser(Long userId);



}
