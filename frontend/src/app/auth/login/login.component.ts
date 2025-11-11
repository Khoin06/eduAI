// src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppComponent } from '../../app.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  constructor(
    private http: HttpClient,
    private app: AppComponent,
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.isLoading = true;

    this.http
      .post<any>('http://localhost:8080/api/auth/login', {
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (res) => {
          console.log('Login response:', res);

          // LẤY userId, username, token
          const userData = { id: res.id, username: res.username, role: res.role };
          const token = res.token; // Backend phải trả token

          // LƯU QUA AuthService
          this.authService.login(userData, token);

          // CHUYỂN HƯỚNG
          if (res.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        },
        error: () => {
          alert('Đăng nhập thất bại!');
          this.isLoading = false;
        },
      });
  }
}
