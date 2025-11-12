import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css',
})
export class Courses {

  courses: any[] = [];
  editingCourse: any = null;

  newCourse = {
    title: '',
    description: '',
    imageUrl: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses() {
    this.http.get<any[]>('http://localhost:8080/api/courses')
      .subscribe({
        next: res => {
          this.courses = res;
        },
        error: err => {
          console.error('Lỗi load khóa học', err);
        }
      });
  }

  addCourse() {
    if (!this.newCourse.title) return;

    this.http.post('http://localhost:8080/api/courses', this.newCourse)
      .subscribe({
        next: res => {
          this.newCourse = { title: '', description: '', imageUrl: '' };
          this.loadCourses();
        },
        error: err => {
          console.error('Lỗi thêm khóa học', err);
        }
      });
  }

  editCourse(course: any) {
    this.editingCourse = { ...course }; 
  }

  saveCourse() {
    if (!this.editingCourse) return;

    const id = this.editingCourse.id;

    this.http.put(`http://localhost:8080/api/courses/${id}`, this.editingCourse)
      .subscribe({
        next: res => {
          this.editingCourse = null;
          this.loadCourses();
        },
        error: err => {
          console.error('Lỗi cập nhật khóa học', err);
        }
      });
  }

  cancelEdit() {
    this.editingCourse = null;
  }

  deleteCourse(id: number) {
    if (confirm('Bạn chắc chắn muốn xóa khóa học này?')) {
      this.http.delete(`http://localhost:8080/api/courses/${id}`)
        .subscribe({
          next: res => {
            this.loadCourses();
          },
          error: err => {
            console.error('Lỗi xóa khóa học', err);
          }
        });
    }
  }
  goToDetail(id: number) {
  this.router.navigate(['/admin/course', id]);
}
}
