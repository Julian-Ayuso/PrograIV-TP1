import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Supabase } from '../servicios/supabase';

export const loginGuard: CanActivateFn = (route, state) => {

  const authService = inject(Supabase);

  return authService.logeado();
};