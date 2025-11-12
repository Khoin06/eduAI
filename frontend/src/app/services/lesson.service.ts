// src/app/services/lesson.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({ providedIn: 'root' })
export class LessonService {
  private api = `${'http://localhost:8080/api'}/lessons`;

  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  getByCourse(courseId: number) {
    return this.http.get<any[]>(`${this.api}/course/${courseId}`);
  }
  createLesson(lesson: any) {
  return this.http.post(`${this.api}`, lesson);
}

updateLesson(id: number, lesson: any) {
  return this.http.put(`${this.api}/${id}`, lesson);
}

deleteLesson(id: number) {
  return this.http.delete(`${this.api}/${id}`);
}

}