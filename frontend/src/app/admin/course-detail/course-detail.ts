import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.css',
})
export class CourseDetail {
  courseId!: number;
  course: any;
  lessons: any[] = [];
  isLoading = true;
  editingLesson: any = null;

  showAddForm = false;
newLesson: any = { title: '', description: '', duration: '', videoUrl: '', courseId: 0 };

editingCourse = false;
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    
  }

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCourse();
    this.loadLessons();
  }

  loadCourse() {
    this.http.get(`http://localhost:8080/api/courses/${this.courseId}`).subscribe((res) => {
      this.course = res;
      this.isLoading = false;
    });
  }

  loadLessons() {
    this.http
      .get<any[]>(`http://localhost:8080/api/courses/${this.courseId}/lessons`)
      .subscribe((res) => {
        this.lessons = res;
        this.isLoading = false;
      });
  }

  editLesson(lesson: any) {
    this.editingLesson = { ...lesson }; // tạo bản sao để sửa
  }
  saveLesson() {
    const id = this.editingLesson.id;
    const token = localStorage.getItem('token');

    this.http
      .put(`http://localhost:8080/api/lessons/${id}`, this.editingLesson, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .subscribe({
        next: () => {
          this.editingLesson = null;
          this.loadLessons();
        },
        error: (err) => console.error('Lỗi cập nhật bài học', err),
      });
  }
  deleteLesson(id: number) {
    if (confirm('Bạn có chắc muốn xóa bài học này?')) {
      this.http.delete(`http://localhost:8080/api/lessons/${id}`).subscribe((res) => {
        this.loadLessons();
      });
    }
  }
  cancelEdit() {
    this.editingLesson = null;
  }
openAddLesson() {
  this.newLesson.courseId = this.courseId; // Gắn khóa học hiện tại
  this.showAddForm = true;
}

addLesson() {
  const token = localStorage.getItem('token');
  
  this.http.post('http://localhost:8080/api/lessons', this.newLesson, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: () => {
      this.showAddForm = false;
      this.newLesson = { title: '', description: '', duration: '', videoUrl: '', courseId: this.courseId };
      this.loadLessons(); // Refresh danh sách
    },
    error: err => {
      console.error('❌ Lỗi thêm bài học', err);
      alert('Thêm bài học thất bại! Vui lòng kiểm tra quyền hoặc dữ liệu.');
    }
  });
}
  goToLessonDetail(lessonId: number) {
    console.log('➡️ Chuyển tới bài học ID:', lessonId);
    this.router.navigate([`/admin/lesson/${lessonId}`]);
  }
  // Bật chế độ chỉnh sửa
editCourse() {
  this.editingCourse = true;
}

// Hủy chỉnh sửa
cancelEditCourse() {
  this.editingCourse = false;
  this.loadCourse(); // tải lại dữ liệu cũ
}

// Lưu thay đổi (PUT API)
saveCourse() {
  const token = localStorage.getItem('token');
  this.http.put(`http://localhost:8080/api/courses/${this.courseId}`, this.course, {
    headers: { Authorization: `Bearer ${token}` }
  }).subscribe({
    next: () => {
      alert('Cập nhật khóa học thành công!');
      this.editingCourse = false;
    },
    error: err => {
      console.error('❌ Lỗi cập nhật khóa học:', err);
      alert('Không thể cập nhật khóa học.');
    }
  });
}
}
