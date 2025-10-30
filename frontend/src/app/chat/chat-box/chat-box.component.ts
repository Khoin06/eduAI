// src/app/chat-box/chat-box.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';


@Component({
  selector: 'app-chat-box',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.css'
})
export class ChatBoxComponent {
  messages: any[] = [];
  question = '';
  lessonId = 1; // Thay bằng route param sau

  constructor(private chatService: ChatService) {}

  send() {
    if (!this.question.trim()) return;
    this.chatService.ask({ lessonId: this.lessonId, question: this.question })
      .subscribe(res => {
        this.messages.push({ q: this.question, a: res.answer });
        this.question = '';
      });
  }
}