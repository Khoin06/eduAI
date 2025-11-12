import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  courses: any[] = [];
  totalCourses = 0;
  totalLessons = 0;
  totalUsers = 0;
  users: any[] = [];

  // ✅ Biến CRUD
  editingCourse: any = null;
  newCourse = { title: '', description: '' };

  lessons: any[] = [];
  editingLesson: any = null;
  newLesson = { title: '', content: '', duration: 0, courseId: 1 };
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCourses();
    this.totalLessons = 120;
    this.loadUsers();
  }

  loadCourses() {
    this.http.get<any[]>('http://localhost:8080/api/courses').subscribe({
      next: (res) => {
        this.courses = res;
        this.totalCourses = res.length;
      },
      error: () => alert('Không tải được danh sách khóa học'),
    });
  }
  loadUsers() {
    this.http.get<any[]>('http://localhost:8080/api/users').subscribe({
      next: (data) => {
        this.users = data.filter((u) => u.role === 'STUDENT');
        this.totalUsers = this.users.length;
      },
    });
  }

  // ✅ Xóa
  deleteCourse(id: number) {
    if (!confirm('Bạn chắc chắn muốn xóa?')) return;

    this.http.delete(`http://localhost:8080/api/courses/${id}`).subscribe({
      next: () => this.loadCourses(),
      error: () => alert('Xóa thất bại!'),
    });
  }

  // ✅ Bật chế độ sửa
  editCourse(course: any) {
    this.editingCourse = { ...course };
  }

  // ✅ Lưu cập nhật
  saveCourse() {
    this.http
      .put(`http://localhost:8080/api/courses/${this.editingCourse.id}`, this.editingCourse)
      .subscribe({
        next: () => {
          this.editingCourse = null;
          this.loadCourses();
        },
        error: () => alert('Cập nhật thất bại!'),
      });
  }

  cancelEdit() {
    this.editingCourse = null;
  }

  // ✅ Thêm khóa học
  addCourse() {
    if (!this.newCourse.title) {
      alert('Vui lòng nhập tên khóa học!');
      return;
    }

    this.http.post('http://localhost:8080/api/admin/courses', this.newCourse).subscribe({
      next: () => {
        this.newCourse = { title: '', description: '' };
        this.loadCourses();
      },
      error: () => alert('Thêm khóa học thất bại!'),
    });
  }
}
