import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ChatDialogComponent } from '../../lesson-detail/chat-dialog/chat-dialog.component';

@Component({
  selector: 'app-lesson-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lesson-detail.component.html',
})
export class LessonDetailComponent implements OnInit {
  lesson: any;
  quiz: any;
  aiData: any = null;
  isLoading = true;
  reachedBottom = false;
  showQuiz = false;

  constructor(private route: ActivatedRoute, private http: HttpClient,private dialog: MatDialog) {}

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
    data: { suggestions: this.aiData?.suggestions || [] }
  });
}

  // 👇 Khi scroll tới cuối, gọi AI
  @HostListener('window:scroll', [])
  onScroll() {
    const scrollBottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
    if (scrollBottom && !this.reachedBottom) {
      this.reachedBottom = true;
      this.loadAISection();
    }
  }

  // 👇 Gọi API Gemini backend
loadAISection() {
  const lessonId = Number(this.route.snapshot.paramMap.get('id'));
  this.http
    .get<any>(`http://localhost:8080/api/ai/lesson-assistant/${lessonId}`)
    .subscribe({
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
  } else {
    console.warn('⚠️ Không có nội dung từ AI:', res);
  }
} catch (err) {
  console.error('❌ Lỗi parse AI JSON:', err, res);
}

      },
      error: (err) => console.error('AI error:', err),
    });
}


}
