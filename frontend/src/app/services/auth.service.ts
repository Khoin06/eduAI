// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${'http://localhost:8080/api'}/auth`;

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(res => localStorage.setItem('token', res.token)));
  }
register(user: any) {
  return this.http.post(`${this.apiUrl}/register`, user);
}
}