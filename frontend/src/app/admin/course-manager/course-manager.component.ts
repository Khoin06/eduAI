// src/app/pages/course-management/course-management.component.ts
import { Component } from '@angular/core';

interface Course {
  name: string;
  instructor: string;
  price: number;
}

@Component({
  selector: 'app-course-management',
  standalone: true,
  imports: [],
  templateUrl: './course-manager.component.html',
})
export class CourseManagementComponent {
  courses: Course[] = [
    { name: 'Angular Cơ bản', instructor: 'Nguyễn Văn A', price: 1200000 },
    { name: 'ReactJS Pro', instructor: 'Trần Thị B', price: 1500000 }
  ];

  showModal = false;
  isEdit = false;
  editIndex = -1;
  tempCourse: Course = { name: '', instructor: '', price: 0 };

  openAddModal() {
    this.isEdit = false;
    this.tempCourse = { name: '', instructor: '', price: 0 };
    this.showModal = true;
  }

  editCourse(index: number) {
    this.isEdit = true;
    this.editIndex = index;
    this.tempCourse = { ...this.courses[index] };
    this.showModal = true;
  }

  saveCourse() {
    if (this.tempCourse.name && this.tempCourse.price > 0) {
      if (this.isEdit) {
        this.courses[this.editIndex] = { ...this.tempCourse };
      } else {
        this.courses.push({ ...this.tempCourse });
      }
      this.closeModal();
    }
  }

  deleteCourse(index: number) {
    if (confirm('Xóa khóa học này?')) {
      this.courses.splice(index, 1);
    }
  }

  closeModal() {
    this.showModal = false;
  }
}