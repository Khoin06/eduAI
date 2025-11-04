package com.example.demo.model;

import java.io.Serializable;
import java.util.Objects;

public class UserCourseId implements Serializable {
    private Long userId;
    private Long courseId;

    // Constructor rỗng (bắt buộc)
    public UserCourseId() {}

    public UserCourseId(Long userId, Long courseId) {
        this.userId = userId;
        this.courseId = courseId;
    }

    // equals() và hashCode() – BẮT BUỘC
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserCourseId that = (UserCourseId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(courseId, that.courseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, courseId);
    }
}