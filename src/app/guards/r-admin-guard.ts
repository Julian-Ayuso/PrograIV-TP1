import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { Auth } from '../servicios/auth';

export const rAdminGuard: CanMatchFn = (route, segments) => {
  const authService = inject(Auth);
  if (authService.isLoggedIn() && authService.getUserRole() === 'admin'){
    return true;
  } return false;
};
