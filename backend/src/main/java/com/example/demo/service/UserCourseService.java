package com.example.demo.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.UserCourse;
import com.example.demo.repository.UserCourseRepository;

import jakarta.transaction.Transactional;

import com.example.demo.repository.LessonRepository;
import com.example.demo.repository.LessonProgressRepository;


@Service
@Transactional
public class UserCourseService {
    @Autowired
    private UserCourseRepository userCourseRepository;
    @Autowired
    private LessonRepository lessonRepository;
        @Autowired
    private LessonProgressRepository lessonProgressRepository;

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

    public void deleteByCourseId(Long courseId) {
        userCourseRepository.deleteByCourseId(courseId);
    }

    public void add(Long userId, Long courseId) {
        UserCourse uc = new UserCourse();
        uc.setUserId(userId);
        uc.setCourseId(courseId);
        uc.setProgress(0);
        userCourseRepository.save(uc);
    }
public int updateCourseProgress(Long userId, Long courseId) {

        int totalLessons = lessonRepository.countByCourse_Id(courseId);
        int passedLessons = lessonProgressRepository.countByUser_IdAndLesson_Course_IdAndPassed(userId, courseId,true);


        int progress = (int) Math.floor((double) passedLessons / totalLessons * 100);

UserCourse uc = userCourseRepository.findByUserIdAndCourseId(userId, courseId)
        .orElseGet(() -> {
            UserCourse newUC = new UserCourse();
            newUC.setUserId(userId);
            newUC.setCourseId(courseId);
            return newUC;
        });

        uc.setProgress(progress);
        userCourseRepository.save(uc);
System.out.println("Saved user course: " + uc.getProgress());
        return progress;
    }
        public List<Map<String, Object>> getProgressByUser(Long userId) {
        return userCourseRepository.getProgressByUser(userId);
    }
}