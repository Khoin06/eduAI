import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  progress?: number;
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  courses: Course[] = [];
  currentUser: any = null;
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // ✅ Lấy thông tin user hiện tại
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser?.id) {
      console.error('Không tìm thấy user ID!');
      return;
    }

    this.loadMyCourses();
  }
  loadMyCourses() {
    const userId = this.currentUser.id;

    // 1️⃣ Lấy danh sách khóa học
    this.http.get<Course[]>(`http://localhost:8080/api/courses/my-courses/${userId}`).subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('✅ Courses fetched from API:', this.courses);
        //
      },
      error: (err) => console.error('Lỗi load courses:', err),
    });
  }

  goToCourseDetail(courseId: number) {
    this.router.navigate(['/course', courseId]);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
