import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ChatDialogComponent } from '../chat-dialog/chat-dialog.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LessonService } from '../../services/lesson.service';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lesson-detail.component.html',
})
export class LessonDetailComponent implements OnInit {
  lesson: any;
  quiz: any;
  aiData: any = null;
  isLoading = true;
  reachedBottom = false;
  showQuiz = false;
  userAnswers: string[] = []; // lưu đáp án người dùng chọn
  score: number | null = null; // điểm số
  submitted = false; // trạng thái đã nộp hay chưa
  resultStatus: ("correct" | "wrong" | null)[] = [];


  isGeneratingQuiz = false; // trạng thái loading quiz AI
  quizError: string | null = null; // nếu lỗi AI
  constructor(private route: ActivatedRoute, private http: HttpClient, private dialog: MatDialog, private router: Router,private api: LessonService) {}

  ngOnInit() {
    const lessonId = Number(this.route.snapshot.paramMap.get('id'));
    if (lessonId) this.loadLesson(lessonId);
  }

  loadLesson(lessonId: number) {
    this.http.get(`http://localhost:8080/api/lessons/${lessonId}`).subscribe({
      next: (data: any) => {
        this.lesson = data;
        this.isLoading = false;
        // this.loadQuiz(lessonId);
      },
      error: () => alert('Không tìm thấy bài học!'),
    });
  }

  // loadQuiz(lessonId: number) {
  //   this.http.get(`http://localhost:8080/api/quizzes/lesson/${lessonId}`).subscribe({
  //     next: (quiz: any) => (this.quiz = quiz),
  //     error: () => console.log('Không có quiz cho bài này'),
  //   });
  // }
  toggleQuiz() {
    this.showQuiz = !this.showQuiz;
  }
  openChatDialog() {
    this.dialog.open(ChatDialogComponent, {
      width: '600px',
      height: '500px',
      data: { suggestions: this.aiData?.suggestions || [] },
    });
  }


  // 👇 Gọi API Gemini backend
 loadAISection() {
  if (this.isGeneratingQuiz) return;      // ⛔ chặn spam
  this.isGeneratingQuiz = true;

  const lessonId = Number(this.route.snapshot.paramMap.get('id'));
  this.quizError = null;
  this.showQuiz = false;

  this.http.get<any>(`http://localhost:8080/api/ai/lesson-assistant/${lessonId}`)
    .subscribe({
      next: (res) => {
        try {
          const text = res?.aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text) {
            const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
            this.aiData = JSON.parse(cleaned);
            this.showQuiz = true;
            this.submitted = false;
            this.userAnswers = [];
            this.resultStatus = [];
            this.score = null;
          } else {
            this.quizError = 'Không nhận được dữ liệu từ AI.';
          }
        } catch (err) {
          this.quizError = 'Lỗi khi phân tích dữ liệu từ AI.';
        }

        // ⏳ cooldown 3 giây
        setTimeout(() => { this.isGeneratingQuiz = false; }, 3000);
      },

      error: (err) => {
        console.error('AI error:', err);
        this.quizError = 'Không thể kết nối đến AI. Vui lòng thử lại.';

        // ⏳ cooldown 3 giây
        setTimeout(() => { this.isGeneratingQuiz = false; }, 3000);
      }
    });
}
  selectAnswer(questionIndex: number, option: string) {
    this.userAnswers[questionIndex] = option.charAt(0); // chỉ lấy A/B/C/D
  }

  submitQuiz() {
    if (!this.aiData?.quiz) return;

    let correctCount = 0;
    this.aiData.quiz.forEach((q: any, i: number) => {
    const user = this.userAnswers[i];
    const isCorrect = user === q.answer;

    if (isCorrect) {
        correctCount++;
      }
          this.resultStatus[i] = isCorrect ? "correct" : "wrong";
    });

    this.score = correctCount;
    this.submitted = true;

    alert(`🎯 Bạn được ${correctCount}/${this.aiData.quiz.length} điểm!`);
        const lessonId = Number(this.route.snapshot.paramMap.get('id'));
    const userId = Number(localStorage.getItem('userId')) || 1; // fallback demo

    this.api.submitProgress({ userId, lessonId, score: correctCount }).subscribe({
      next: () => {
        alert(`🎯 Bạn được ${correctCount}/${this.aiData.quiz.length} điểm! (Đã lưu vào DB)`);
      },
      error: (err: any) => {
        console.error('Lưu progress lỗi', err);
        alert('Lưu điểm thất bại — thử lại sau.');
      }
    });
  }
}