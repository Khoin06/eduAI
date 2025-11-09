package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Course;
import com.example.demo.model.Lesson;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LessonRepository;

import java.util.List;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepo;
    @Autowired
    private LessonRepository lessonRepo;

    public List<Course> getAllCourses() {
        return courseRepo.findAll();
    }

    public List<Course> getCoursesByUserId(Long userId) {
        return courseRepo.findCoursesByUserId(userId);
    }

    public List<Lesson> getLessonsByCourseId(Long courseId) {
        return lessonRepo.findByCourseId(courseId);
    }

    public Course getCourseById(Long id) {
        return courseRepo.findById(id).orElse(null);
    }

    public Course createCourse(Course course) {
        return courseRepo.save(course);
    }

    public Course updateCourse(Long id, Course course) {
        course.setId(id);
        return courseRepo.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepo.deleteById(id);
    }
    public List<Course> getUnselectedCourses(Long userId) {
        return courseRepo.findCoursesNotSelectedByUser(userId);
    }
}
