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
  isAdding = false;
  newUser: any = { username: '', email: '', role: 'STUDENT', password: '' };

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
   startAddUser() {
    this.isAdding = true;
    this.newUser = { username: '', email: '', role: 'STUDENT', password: '' };
  }

  // 👉 Hủy thêm user
  cancelAdd() {
    this.isAdding = false;
  }

  // 👉 Lưu user mới
  saveNewUser() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    this.http.post('http://localhost:8080/api/auth/register', this.newUser, { headers })
      .subscribe({
        next: () => {
          alert('Thêm người dùng thành công!');
          this.isAdding = false;
          this.loadUsers();
        },
        error: (err) => {
          console.error('Lỗi khi thêm người dùng:', err);
          alert('Không thể thêm người dùng!');
        }
      });
  }

  deleteUser(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      this.http.delete(`http://localhost:8080/api/users/${id}`, { headers })
        .subscribe({
          next: () => {
            this.users = this.users.filter(u => u.id !== id);
          },
          error: (err) => {
            console.error('Lỗi khi xóa người dùng:', err);
          }
        });
    }
  }
}
