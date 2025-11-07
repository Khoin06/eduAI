// src/app/pages/course-management/course-management.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FilterPipe } from '../../pipes/filter.pipe';

declare var bootstrap: any;
@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilterPipe], // THÊM RouterModule
  templateUrl: './course-manager.component.html',
})
export class CourseManagementComponent implements OnInit {
  @ViewChild('addModal') addModal!: ElementRef;

  userCourses: any[] = [];
  allCourses: any[] = [];
  selectedCourses: number[] = [];
  searchTerm = '';
  userId!: number; // KHÔNG FIX CỨNG
  private modalInstance: any;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUserId(); // TỰ ĐỘNG LẤY TỪ localStorage
    this.loadUserCourses();
    this.loadAllCourses();
  }
  ngAfterViewInit() {
    // KHỞI TẠO MODAL BẰNG BOOTSTRAP JS
    this.modalInstance = new bootstrap.Modal(this.addModal.nativeElement);
  }
  // LẤY userId TỪ localStorage
  loadUserId() {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    if (user?.id) {
      this.userId = user.id;
    } else {
      alert('Vui lòng đăng nhập!');
      // Tùy chọn: redirect về login
    }
  }

  loadUserCourses() {
    this.http
      .get<any[]>(`http://localhost:8080/api/courses/my-courses`, {
        params: { userId: this.userId },
      })
      .subscribe({
        next: (data) => (this.userCourses = data || []),
        error: () => {
          this.userCourses = [];
          alert('Lỗi tải!');
        },
      });
  }

  loadAllCourses() {
    this.http.get<any[]>('http://localhost:8080/api/courses').subscribe((data) => {
      this.allCourses = data;
    });
  }

  openAddModal() {
    this.selectedCourses = [];
    this.searchTerm = '';
    this.modalInstance.show();
  }

  toggleSelect(courseId: number) {
    const index = this.selectedCourses.indexOf(courseId);
    if (index === -1) {
      this.selectedCourses.push(courseId);
    } else {
      this.selectedCourses.splice(index, 1);
    }
  }

  addSelected() {
    if (this.selectedCourses.length === 0) return;

    const payload = this.selectedCourses.map((courseId) => ({
      userId: this.userId,
      courseId,
    }));

    this.http.post('http://localhost:8080/api/user-courses/batch', payload).subscribe({
      next: () => {
        this.loadUserCourses();
        this.selectedCourses = [];
        this.modalInstance.hide();
      },
      error: () => alert('Thêm thất bại!'),
    });
  }

  removeFromUser(courseId: number) {
    if (confirm('Xóa khỏi danh sách của bạn?')) {
      this.http
        .delete(`http://localhost:8080/api/user-courses?userId=${this.userId}&courseId=${courseId}`)
        .subscribe(() => this.loadUserCourses());
    }
  }
}
