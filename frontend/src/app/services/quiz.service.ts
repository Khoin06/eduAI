// src/app/services/quiz.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({ providedIn: 'root' })
export class QuizService {
  private api = `${'http://localhost:8080/api'}/quiz`;

  constructor(private http: HttpClient) {}

  generate(lessonId: number) {
    return this.http.post<any[]>(`${this.api}/generate`, { lessonId });
  }

  submit(answers: any[]) {
    return this.http.post<{ score: number; correct: number }>(`${this.api}/submit`, { answers });
  }
}