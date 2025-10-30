// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  error = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    if (!this.credentials.username || !this.credentials.password) {
      this.error = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err.error?.message || 'Đăng nhập thất bại.';
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }
}
