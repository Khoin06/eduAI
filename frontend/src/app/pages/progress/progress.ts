import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.html',
  styleUrl: './progress.css',
})
export class Progress {

  progressList: any[] = [];
  userId!: number;      // userId thật
  currentUser: any = null;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.currentUser = this.auth.getCurrentUser();

    if (this.currentUser) {
      this.userId = this.currentUser.id;   // 👈 GÁN USERID ĐÚNG CHỖ
      this.loadProgress();
    }
  }

  loadProgress() {
    this.getUserProgress(this.userId).subscribe(data => {
      this.progressList = data;
      console.log("Progress:", data);
    });
  }

  getUserProgress(userId: number) {
    return this.http.get<any[]>(`http://localhost:8080/api/user-courses/progress/${userId}`);
  }
}
