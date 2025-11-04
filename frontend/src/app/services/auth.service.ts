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
    // KHỞI TẠO TRẠNG THÁI LOGIN TỪ localStorage
    this.isLoggedInSubject.next(this.hasToken());
  }
  login(userData: any, token: string) {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    this.loggedIn.next(true); // ✅ Cập nhật trạng thái
  }


  // THÊM HÀM hasToken()
  hasToken(): boolean {
     return !!localStorage.getItem('token');
  }

  // DÙNG TRONG LOGIN
  setLoggedIn(value: boolean) {
     this.loggedIn.next(value);
  }

getCurrentUser(): any {
  const user = localStorage.getItem('current_user');
  return user ? JSON.parse(user) : null;
}

  logout() {
   localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.loggedIn.next(false); 
  }
}