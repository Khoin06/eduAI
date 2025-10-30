// src/app/services/courses.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable({ providedIn: 'root' })
export class CourseService {
  private api = `${'http://localhost:8080/api'}/courses`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.api);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.api}/${id}`);
  }

  create(course: any) {
    return this.http.post(this.api, course);
  }

  update(id: number, course: any) {
    return this.http.put(`${this.api}/${id}`, course);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}