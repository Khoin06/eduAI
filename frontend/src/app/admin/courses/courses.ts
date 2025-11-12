import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

declare var bootstrap: any; // Dùng Bootstrap JS modal

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './courses.html',
  styleUrls: ['./courses.css'],
})
export class Courses {
  courses: any[] = [];
  editingCourse: any = null;
  modalInstance: any;

  newCourse = {
    title: '',
    description: '',
    imageUrl: '',
  };

  @ViewChild('editCourseModal') editCourseModal!: ElementRef;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.http.get<any[]>('http://localhost:8080/api/courses').subscribe({
      next: (res) => (this.courses = res),
      error: (err) => console.error('Lỗi load khóa học', err),
    });
  }

  addCourse() {
    if (!this.newCourse.title.trim()) {
      alert('Vui lòng nhập tiêu đề khóa học.');
      return;
    }

    this.http.post('http://localhost:8080/api/courses', this.newCourse).subscribe({
      next: () => {
        this.newCourse = { title: '', description: '', imageUrl: '' };
        this.loadCourses();
      },
      error: (err) => console.error('Lỗi thêm khóa học', err),
    });
  }

  editCourse(course: any, event?: Event) {
    if (event) event.stopPropagation();
    this.editingCourse = { ...course };

    // Hiển thị modal Bootstrap
    const modalEl = this.editCourseModal.nativeElement;
    this.modalInstance = new bootstrap.Modal(modalEl);
    this.modalInstance.show();
  }

  saveCourse() {
    if (!this.editingCourse) return;

    const id = this.editingCourse.id;
    this.http.put(`http://localhost:8080/api/courses/${id}`, this.editingCourse).subscribe({
      next: () => {
        alert('✅ Cập nhật thành công!');
        this.modalInstance.hide();
        this.editingCourse = null;
        this.loadCourses();
      },
      error: (err) => console.error('Lỗi cập nhật khóa học', err),
    });
  }

  cancelEdit() {
    if (this.modalInstance) this.modalInstance.hide();
    this.editingCourse = null;
  }

  confirmDelete(id: number, event?: Event) {
    if (event) event.stopPropagation();
    if (!confirm('⚠️ Bạn có chắc muốn xóa khóa học này?')) return;

    this.http.delete(`http://localhost:8080/api/courses/${id}`).subscribe({
      next: () => {
        alert('✅ Xóa khóa học thành công!');
        this.loadCourses();
      },
      error: (err) => {
        console.error('❌ Lỗi xóa khóa học:', err);
        alert('Không thể xóa khóa học.');
      },
    });
  }

  goToDetail(id: number) {
    this.router.navigate(['/admin/course', id]);
  }
}
