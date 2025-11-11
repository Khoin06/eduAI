import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent {
  userInput = '';
  messages = [{ role: 'ai', text: 'Xin chào! Tôi là trợ giảng AI. Bạn muốn hỏi gì?' }];
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<ChatDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const message = this.userInput;
    this.messages.push({ role: 'user', text: message });
    this.userInput = '';
    this.loading = true;

    this.http
      .post<any>('http://localhost:8080/api/ai/chat', { message })
      .subscribe({
        next: (res) => {
          const raw = res.reply;
          let text = 'Không có phản hồi.';
          try {
            const obj = JSON.parse(raw);
            text = obj?.candidates?.[0]?.content?.parts?.[0]?.text || text;
          } catch {
            text = raw;
          }
          this.messages.push({ role: 'ai', text });
          this.loading = false;
        },
        error: (err) => {
          console.error('Chat error:', err);
          this.messages.push({ role: 'ai', text: '⚠️ Lỗi kết nối đến server.' });
          this.loading = false;
        },
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
