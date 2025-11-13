import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

declare var bootstrap: any;
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
  userCourses: any[] = [];
  unselectedCourses: any[] = [];

  selectedUser: any = null;
  selectedCourseId: number | null = null;
  searchTerm: string = "";
@ViewChild('userModal') userModal!: ElementRef;
modalInstance: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }
  loadUsers() {
    const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

    this.http.get<any[]>('http://localhost:8080/api/users', { headers }).subscribe({
      next: (data) => {
        this.users = data.filter((u) => u.role === 'STUDENT');
        this.loading = false; // ✅ tắt loading khi nhận được dữ liệu
      },
      error: (err) => {
        console.error('Lỗi tải danh sách người dùng:', err);
        this.loading = false;
      },
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

    this.http.post('http://localhost:8080/api/auth/register', this.newUser, { headers }).subscribe({
      next: () => {
        alert('Thêm người dùng thành công!');
        this.isAdding = false;
        this.loadUsers();
      },
      error: (err) => {
        console.error('Lỗi khi thêm người dùng:', err);
        alert('Không thể thêm người dùng!');
      },
    });
  }

  deleteUser(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      this.http.delete(`http://localhost:8080/api/users/${id}`, { headers }).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u.id !== id);
        },
        error: (err) => {
          console.error('Lỗi khi xóa người dùng:', err);
        },
      });
    }
  }
  openUserCourses(user: any) {
    this.selectedUser = user;

    // Load khóa học đang học
    this.http.get<any[]>(`http://localhost:8080/api/courses/my-courses/${user.id}`)
      .subscribe(res => this.userCourses = res);

    // Load khóa học chưa học
    this.http.get<any[]>(`http://localhost:8080/api/courses/unselected?userId=${user.id}`)
      .subscribe(res => this.unselectedCourses = res);

    // Show modal
  setTimeout(() => {
        this.modalInstance = new bootstrap.Modal(
      this.userModal.nativeElement,
      { backdrop: true, keyboard: true }
    );
    this.modalInstance.show();
  }, 50);
  }
closeModal() {
  if (this.modalInstance) {
    this.modalInstance.hide();
          // XÓA backdrop nếu còn tồn tại
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

      // GỠ class bị kẹt khi modal đóng
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
  }
}

  // ================== GHI DANH ==================
  enrollCourse() {
    if (!this.selectedCourseId) return;

    this.http.post(`http://localhost:8080/api/user-courses`, {
      userId: this.selectedUser.id,
      courseId: this.selectedCourseId,
    })
    .subscribe({
      next: () => this.openUserCourses(this.selectedUser),
      error: err => console.error("Lỗi ghi danh:", err)
    });
  }

  // ================== GỠ KHỎA HỌC ==================
  unenrollCourse(courseId: number) {
    if (!confirm("Bạn chắc chắn muốn gỡ khóa học này?")) return;

    this.http.delete(
      `http://localhost:8080/api/user-courses?userId=${this.selectedUser.id}&courseId=${courseId}`
    )
    .subscribe({
      next: () => this.openUserCourses(this.selectedUser),
      error: err => console.error("Lỗi gỡ khóa học:", err)
    });
  }
filteredUsers() {
  if (!this.searchTerm) return this.users;

  const term = this.searchTerm.toLowerCase();

  return this.users.filter(user =>
    user.username.toLowerCase().includes(term) ||
    (user.email && user.email.toLowerCase().includes(term)) ||
    user.id.toString().includes(term)
  );
}
}

