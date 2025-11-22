package com.example.demo.model;

 import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "lessons")
public class Lesson {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false) // Ánh xạ tới cột FK 'course_id' trong DB
    @JsonIgnore
    private Course course; // Tên thuộc tính này cho phép JPQL truy cập: lp.lesson.course.id

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String content;

    private String videoUrl;
    private int duration;
    private int orderIndex;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public int getDuration() { return duration; }
    public void setDuration(int duration) { this.duration = duration; }
    public int getOrderIndex() { return orderIndex; }
    public void setOrderIndex(int orderIndex) { this.orderIndex = orderIndex; }
}
