// src/app/services/auth.service.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private platformId = inject(PLATFORM_ID);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    // ✅ Khởi tạo trạng thái login
    this.isLoggedInSubject.next(this.hasToken());
  }

  /**
   * ✅ Gọi khi login thành công
   */
  login(userData: any, token: string) {
    // Lưu user vào localStorage với key thống nhất
    localStorage.setItem('current_user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true);
  }

  /**
   * ✅ Kiểm tra có token hay không
   */
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * ✅ Lấy thông tin user hiện tại
   */
  getCurrentUser(): any {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * ✅ Đăng xuất
   */
  logout() {
    localStorage.removeItem('current_user');
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }

  /**
   * ✅ Dùng trong guard hoặc header
   */
  setLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }
}
