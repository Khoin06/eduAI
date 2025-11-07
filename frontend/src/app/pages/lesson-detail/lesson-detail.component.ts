// src/app/pages/lesson-detail/lesson-detail.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-detail.component.html'
})
export class LessonDetailComponent implements OnInit {
  lesson: any;
  quiz: any;
  isLoading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const lessonId = Number(this.route.snapshot.paramMap.get('id'));
    if (lessonId) this.loadLesson(lessonId);
  }

  loadLesson(lessonId: number) {
    this.http.get(`http://localhost:8080/api/lessons/${lessonId}`).subscribe({
      next: (data: any) => {
        this.lesson = data;
        this.isLoading = false;
        this.loadQuiz(lessonId);
      },
      error: () => alert('Không tìm thấy bài học!')
    });
  }

  loadQuiz(lessonId: number) {
    this.http.get(`http://localhost:8080/api/quizzes/lesson/${lessonId}`).subscribe({
      next: (quiz: any) => this.quiz = quiz,
      error: () => console.log('Không có quiz cho bài này')
    });
  }
}
