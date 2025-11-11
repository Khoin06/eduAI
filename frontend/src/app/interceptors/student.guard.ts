import { CanActivateFn } from "@angular/router";

export const studentGuard: CanActivateFn = () => {
  const role = localStorage.getItem('role');
  return role === 'STUDENT';
};
