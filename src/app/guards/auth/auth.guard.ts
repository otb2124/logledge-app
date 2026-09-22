import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is already loaded in signal, grant access immediately
  if (authService.isAuthenticated()) {
    return true;
  }

  // Otherwise, fetch session from backend cookie first
  return authService.fetchMe().pipe(
    map((user) => {
      if (user) {
        return true;
      }
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};