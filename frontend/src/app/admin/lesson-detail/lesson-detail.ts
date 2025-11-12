import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lesson-detail.html',
})
export class LessonDetail implements OnInit {
  lesson: any;
  editing = false;
  editedLesson = { title: '', content: '' };
  isLoading = true;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadLesson(id);
  }

  loadLesson(id: number) {
    this.http.get(`http://localhost:8080/api/lessons/${id}`).subscribe({
      next: (data: any) => {
        this.lesson = data;
        this.isLoading = false;
      },
      error: () => alert('Không tìm thấy bài học!'),
    });
  }

  toggleEdit() {
    this.editing = !this.editing;
    if (this.editing && this.lesson) {
      this.editedLesson = { title: this.lesson.title, content: this.lesson.content };
    }
  }

saveLesson() { 
  if (!this.lesson?.id) return;
  const token = localStorage.getItem('token');

  this.http.put(
    `http://localhost:8080/api/lessons/${this.lesson.id}`,
    this.editedLesson,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ).subscribe({
    next: () => {
      alert('✅ Đã lưu thay đổi bài học!');
      this.lesson = { ...this.lesson, ...this.editedLesson };
      this.editing = false;
    },
    error: (err) => console.error('Lỗi cập nhật bài học:', err),
  });
}


  deleteLesson() {
    if (!confirm('⚠️ Bạn có chắc muốn xóa bài học này?')) return;

    this.http.delete(`http://localhost:8080/api/lessons/${this.lesson.id}`).subscribe({
      next: () => {
        alert('✅ Bài học đã bị xóa!');
        history.back();
      },
      error: (err) => console.error('Lỗi xóa bài học:', err),
    });
  }
}
