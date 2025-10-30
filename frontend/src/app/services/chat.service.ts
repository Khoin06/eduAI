// src/app/services/chats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })
export class ChatService {
  private api = `${'http://localhost:8080/api'}/chat`;

  constructor(private http: HttpClient) {}

  ask(request: { lessonId: number; question: string }) {
    return this.http.post<{ answer: string }>(this.api, request);
  }
}