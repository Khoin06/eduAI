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
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  isLoading = false;
  constructor(private http: HttpClient,private app: AppComponent,private authService: AuthService,private router: Router) {}

login() {
  this.http.post<any>('http://localhost:8080/api/auth/login', {
    username: this.username,
    password: this.password
  }).subscribe({
next: (res) => {
  console.log('Kết quả trả về từ server:', res);
  if (res && res.username) {
    // Lưu user vào localStorage thông qua AuthService
    this.authService.login(res, 'dummy-token');
    this.router.navigate(['/dashboard']);
  } else {
    alert('Phản hồi từ server không hợp lệ!');
  }
},
    error: () => alert('Đăng nhập thất bại!')
  });
}
}