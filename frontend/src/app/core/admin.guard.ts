//admin.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const AdminGuard: CanActivateFn = () => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser.value;

  if (user && user.user.role === 'admin') {
    console.log(auth.currentUser.value);
    return true;
  }

  router.navigate(['/films']);

  return false;

};