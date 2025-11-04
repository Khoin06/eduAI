// src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RouterLink],
  templateUrl: './register.component.html', // ĐÚNG TÊN FILE
  styleUrl: './register.component.css', // ĐÚNG TÊN FILE
})
export class RegisterComponent {
  username = '';
  password = '';

  error = '';
  isLoading = false;

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  register() {
    this.http
      .post('http://localhost:8080/api/auth/register', {
        username: this.username,
        password: this.password,
      })
      .subscribe({
next: (res) => {
      alert('Đăng ký thành công: ' + res);
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Register error:', err);
      alert(err.error || 'Đăng ký thất bại!');
    }
      });
  }
}
