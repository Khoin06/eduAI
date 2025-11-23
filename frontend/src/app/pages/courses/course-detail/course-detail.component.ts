import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LessonService } from '../../../services/lesson.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.css'],
})
export class CourseDetailComponent implements OnInit {
  course: any;
  lessons: any[] = [];
  selectedLesson: any = null;
  isLoading = true;
  userId: number | null = null;
  unlockedMap: Record<number, boolean> = {};
  totalLessons = 0;
  passedLessons = 0;
  courseProgress = 0;
  passedMap: Record<number, boolean> = {};
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private api: LessonService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const courseId = this.route.snapshot.paramMap.get('id');
    this.userId = Number(localStorage.getItem('userId')) || null;
    if (courseId) {
      this.loadCourseAndLessons(+courseId);
    }
    console.log('⚡ LocalStorage userId =', localStorage.getItem('userId'));
    console.log('⚡ UserId trong component =', this.userId);
  }

  loadCourseAndLessons(courseId: number) {
    this.isLoading = true;

    // GỌI API KHÓA HỌC
    this.http.get(`http://localhost:8080/api/courses/${courseId}`).subscribe({
      next: (data: any) => (this.course = data),
      error: () => alert('Không tìm thấy khóa học!'),
    });

    // GỌI API BÀI HỌC – ĐỘNG THEO ID KHÓA
    this.http.get<any[]>(`http://localhost:8080/api/lessons/course/${courseId}`).subscribe({
      next: (data) => {
        console.log('Dữ liệu bài học:', data);
        this.lessons = data.sort((a: any, b: any) => (a.orderIndex || 0) - (b.orderIndex || 0));
        this.totalLessons = this.lessons.length;
        console.log('✅ 1. Tổng số bài học:', this.totalLessons);
        this.isLoading = false;
        this.checkUnlockStates();
        this.calculateCourseProgress(courseId);
      },
      error: (err) => {
        console.error('Lỗi API bài học:', err);
        this.lessons = [];
        this.isLoading = false;
      },
    });
  }
calculateCourseProgress(courseId: number) {
  console.log('⚡ BẮT ĐẦU tính toán tiến độ...');
  if (!this.userId || this.totalLessons === 0) {
    this.courseProgress = 0;
    return;
  }

  const url = `http://localhost:8080/api/progress/course/${courseId}/user/${this.userId}`;
  
  // GỌI API ĐỂ LẤY SỐ BÀI HỌC ĐÃ VƯỢT QUA
  this.http.get<number>(url).subscribe({
    next: (count) => {
      this.passedLessons = count;
      // Tính toán tỷ lệ phần trăm
      this.courseProgress = Math.floor((this.passedLessons / this.totalLessons) * 100);
      this.passedMap = {};
      console.log(`✅ 2.Tiến độ khóa học: ${this.passedLessons}/${this.totalLessons} (${this.courseProgress}%)`);
      this.updateProgress(courseId).subscribe({
        next: () => console.log('Progress updated successfully'),
        error: (err) => console.error('❌ Lỗi update progress:', err)
      });
    },
      error: (err) => {
        if (err.status === 403) {
          console.error('❌ Lỗi 403 (Forbidden): API tiến độ bị chặn. Cần sửa Spring Security.', err.url);
        } else {
          console.error('❌ Lỗi tính tiến độ:', err);
        }
        this.courseProgress = 0;
      }
  });
}
updateProgress(courseId: number) {
  const url = `http://localhost:8080/api/progress/update/${courseId}/user/${this.userId}`;
  return this.http.post(url, {});
}

  // Khi người dùng chọn bài học
  selectLesson(lesson: any) {
    this.selectedLesson = lesson;
    this.loadQuiz(lesson.id);
  }

  // Gọi quiz (nếu có)
  loadQuiz(lessonId: number) {
    this.http.get(`http://localhost:8080/api/quizzes/lesson/${lessonId}`).subscribe({
      next: (quiz: any) => (this.selectedLesson.quiz = quiz),
      error: () => console.log('Không có quiz cho bài này'),
    });
  }
  // Kiểm tra bài có mở không (dựa trên bài trước)
  async isUnlockedForLessonIndex(index: number): Promise<boolean> {
    // bài đầu luôn mở
    if (index === 0) return true;

    const prevLesson = this.lessons[index - 1];
    if (!prevLesson) return false;

    // kiểm tra cache
    if (this.unlockedMap[prevLesson.id] !== undefined) {
      return this.unlockedMap[prevLesson.id];
    }

    if (!this.userId) {
      // nếu chưa login, coi là khoá (bạn có thể cho phép view nhưng ko mở)
      this.unlockedMap[prevLesson.id] = false;
      return false;
    }

    try {
      const res = await this.api.checkPassed(this.userId, prevLesson.id).toPromise();
      this.unlockedMap[prevLesson.id] = !!res;
      return !!res;
    } catch (err) {
      console.error('Lỗi checkPassed', err);
      this.unlockedMap[prevLesson.id] = false;
      return false;
    }
  }
  // khi user nhấn mở bài
  async goToLesson(lesson: any, index: number) {
    const unlocked = await this.isUnlockedForLessonIndex(index);
    if (!unlocked) {
      alert('⚠️ Bạn cần đạt >= 8 điểm ở bài trước để mở bài này.');
      return;
    }
    this.router.navigate(['/lesson', lesson.id]);
  }
async checkUnlockStates() {
  if (!this.userId) return;

  this.passedMap = {};
  this.unlockedMap = {};

  for (let i = 0; i < this.lessons.length; i++) {
    const lessonId = this.lessons[i].id;
    try {
      const passed = await this.api.checkPassed(this.userId, lessonId).toPromise();
      this.passedMap[lessonId] = !!passed;

      // Bài đầu tiên luôn unlock
      if (i === 0) {
        this.unlockedMap[lessonId] = true;
      } else {
        const prevLessonId = this.lessons[i - 1].id;
        this.unlockedMap[lessonId] = !!this.passedMap[prevLessonId];
      }
      this.cd.detectChanges();
      console.log(`Lesson ${i + 1} (ID: ${lessonId}) -> passed: ${passed}, unlocked: ${this.unlockedMap[lessonId]}`);
    } catch (err) {
      console.error('Lỗi checkPassed:', err);
      this.passedMap[lessonId] = false;
      this.unlockedMap[lessonId] = false;
    }
  }
}

  
}
