// src/app/services/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};