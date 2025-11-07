// src/app/pages/course-detail/course-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  course: any;
  lessons: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id'); // LẤY ID TỪ URL
    if (courseId) {
      this.loadCourseAndLessons(+courseId); // CHUYỂN SANG NUMBER
    }
  }

  loadCourseAndLessons(courseId: number) {
    // GỌI API KHÓA HỌC
    this.http.get(`http://localhost:8080/api/courses/${courseId}`).subscribe({
      next: (data: any) => (this.course = data),
      error: () => alert('Không tìm thấy khóa học!'),
    });

    // GỌI API BÀI HỌC – ĐỘNG THEO ID
    this.http.get<any[]>(`http://localhost:8080/api/courses/${courseId}/lessons`).subscribe({
      next: (data) => (this.lessons = data),
      error: () => (this.lessons = []),
    });
  }
}
