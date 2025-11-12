import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  users: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }


  loadUsers() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    this.http.get<any[]>('http://localhost:8080/api/users', { headers })
      .subscribe({
        next: (data) => {
          this.users = data.filter(u => u.role === 'STUDENT');
          this.loading = false; // ✅ tắt loading khi nhận được dữ liệu
        },
        error: (err) => {
          console.error('Lỗi tải danh sách người dùng:', err);
          this.loading = false;
        }
      });
  }

  deleteUser(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      this.http.delete(`http://localhost:8080/api/users/${id}`).subscribe({
        next: () => this.loadUsers(),
        error: (err) => console.error('Lỗi xóa người dùng:', err),
      });
    }
  }
}
