// src/app/chat/chat-box/chat-box.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';


@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css'
})
export class ChatBoxComponent {
  // SỬA TÊN BIẾN: DÙNG 'q' và 'a' HOẶC DÙNG 'question' và 'answer'
  messages: { q: string; a: string }[] = [];  // ĐÃ SỬA
  question = '';
  lessonId!: number;

  constructor(private chatService: ChatService, private route: ActivatedRoute) {
    this.lessonId = +this.route.snapshot.paramMap.get('lessonId')!;
  }

  send() {
    if (!this.question.trim()) return;

    const userQuestion = this.question;
    this.messages.push({ q: userQuestion, a: 'Đang suy nghĩ...' });

    this.chatService.ask({ lessonId: this.lessonId, question: userQuestion }).subscribe({
      next: (res) => {
        const index = this.messages.findIndex(m => m.a === 'Đang suy nghĩ...');
        if (index !== -1) {
          this.messages[index].a = res.answer;
        }
      },
      error: () => {
        const index = this.messages.findIndex(m => m.a === 'Đang suy nghĩ...');
        if (index !== -1) {
          this.messages[index].a = 'Lỗi kết nối AI';
        }
      }
    });

    this.question = '';
  }
}