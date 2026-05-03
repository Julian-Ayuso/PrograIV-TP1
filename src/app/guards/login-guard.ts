import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Auth } from '../servicios/auth';

export const loginGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(Auth);

  return authService.isLoggedIn();
};
