import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  course: any;
  lessons: any[] = [];
  selectedLesson: any = null;
  isLoading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.loadCourseAndLessons(+courseId);
    }
  }

  loadCourseAndLessons(courseId: number) {
    this.isLoading = true;

    // GỌI API KHÓA HỌC
    this.http.get(`http://localhost:8080/api/courses/${courseId}`).subscribe({
      next: (data: any) => (this.course = data),
      error: () => alert('Không tìm thấy khóa học!'),
    });

    // GỌI API BÀI HỌC – ĐỘNG THEO ID KHÓA
    this.http.get<any[]>(`http://localhost:8080/api/lessons/course/${courseId}`).subscribe({
      next: (data) => {
        console.log('Dữ liệu bài học:', data);
        this.lessons = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Lỗi API bài học:', err);
        this.lessons = [];
        this.isLoading = false;
      },
    });
  }

  // Khi người dùng chọn bài học
  selectLesson(lesson: any) {
    this.selectedLesson = lesson;
    this.loadQuiz(lesson.id);
  }

  // Gọi quiz (nếu có)
  loadQuiz(lessonId: number) {
    this.http
      .get(`http://localhost:8080/api/quizzes/lesson/${lessonId}`)
      .subscribe({
        next: (quiz: any) => (this.selectedLesson.quiz = quiz),
        error: () => console.log('Không có quiz cho bài này'),
      });
  }
}
