package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_courses")
@IdClass(UserCourseId.class)
public class UserCourse {
    @Id
    @Column(name = "user_id")
    private Long userId;

    @Id
    @Column(name = "course_id")
    private Long courseId;

    private LocalDateTime enrolledAt = LocalDateTime.now();
    private int progress = 0;

    // Getters & Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }
    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }
}