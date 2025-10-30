// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',  // ĐÚNG TÊN FILE
  styleUrl: './register.component.css'       // ĐÚNG TÊN FILE
})
export class RegisterComponent {
  user = {
    username: '',
    password: '',
    email: '',
    fullName: ''
  };
  error = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    if (!this.user.username || !this.user.password || !this.user.email) {
      this.error = 'Vui lòng nhập đầy đủ thông tin bắt buộc';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.register(this.user).subscribe({
      next: () => {
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Đăng ký thất bại. Tên đăng nhập có thể đã tồn tại.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}