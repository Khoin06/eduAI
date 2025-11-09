import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ChatDialogComponent } from '../../lesson-detail/chat-dialog/chat-dialog.component';
import { FormsModule } from '@angular/forms';

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

  isGeneratingQuiz = false; // trạng thái loading quiz AI
  quizError: string | null = null; // nếu lỗi AI
  constructor(private route: ActivatedRoute, private http: HttpClient, private dialog: MatDialog) {}

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

  // 👇 Khi scroll tới cuối, gọi AI
  @HostListener('window:scroll', [])
  onScroll() {
    const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
    if (scrollBottom && !this.reachedBottom) {
      this.reachedBottom = true;
      this.loadAISection();
    }
  }

  // 👇 Gọi API Gemini backend
  loadAISection() {
    const lessonId = Number(this.route.snapshot.paramMap.get('id'));
    this.isGeneratingQuiz = true;
    this.quizError = null;
    this.showQuiz = false;
    this.http.get<any>(`http://localhost:8080/api/ai/lesson-assistant/${lessonId}`).subscribe({
      next: (res) => {
        try {
          const text = res?.aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            // 🔹 Làm sạch chuỗi Markdown (bỏ ```json và ```)
            const cleaned = text
              .replace(/```json/g, '')
              .replace(/```/g, '')
              .trim();

            // 🔹 Parse JSON sạch
            this.aiData = JSON.parse(cleaned);
            console.log('✅ AI data parsed:', this.aiData);
            this.showQuiz = true;
          } else {
            console.warn('⚠️ Không có nội dung từ AI:', res);
            this.quizError = 'Không nhận được dữ liệu từ AI.';
          }
        } catch (err) {
          console.error('❌ Lỗi parse AI JSON:', err, res);
          this.quizError = 'Lỗi khi phân tích dữ liệu từ AI.';
        }
        this.isGeneratingQuiz = false; // tắt loading
      },
      error: (err) => {
        console.error('AI error:', err);
        this.quizError = 'Không thể kết nối đến AI. Vui lòng thử lại.';
        this.isGeneratingQuiz = false;
      },
    });
  }
  selectAnswer(questionIndex: number, option: string) {
    this.userAnswers[questionIndex] = option.charAt(0); // chỉ lấy A/B/C/D
  }

  submitQuiz() {
    if (!this.aiData?.quiz) return;

    let correctCount = 0;
    this.aiData.quiz.forEach((q: any, i: number) => {
      if (this.userAnswers[i] === q.answer) {
        correctCount++;
      }
    });

    this.score = correctCount;
    this.submitted = true;

    alert(`🎯 Bạn được ${correctCount}/${this.aiData.quiz.length} điểm!`);
  }
}
