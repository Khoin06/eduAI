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
  styleUrl: './dashboard.component.css'
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

    // ✅ In log xem có lấy được username/fullName không
    console.log('User hiện tại:', this.currentUser);

    // ✅ Gọi API khóa học của user
    const url = `http://localhost:8080/api/courses/my-courses/${this.currentUser.id}`;
    console.log('Gọi API:', url);

    this.http.get<Course[]>(url).subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('Danh sách khóa học:', this.courses);
      },
      error: (err) => console.error('Lỗi API khóa học:', err),
    });
    // this.loadMyCourses();
  }
  // src/app/pages/dashboard/dashboard.component.ts
  loadMyCourses() {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    const userId = user.id;

    if (!userId) return;

    this.http
      .get<any[]>('http://localhost:8080/api/courses/my-courses?userId=' + userId)
      .subscribe((data) => {
        this.courses = data;
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
