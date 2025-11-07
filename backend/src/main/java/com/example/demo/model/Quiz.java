package com.example.demo.model;



import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name ="quizzes")
@Data
public class Quiz {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lesson_id", nullable = false)
    private Long lessonId;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String question;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String explanation;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QuizOption> options;
}
