import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Supaservice } from '../services/supaservice';

export const authGuard: CanActivateFn = async () => {
  const supaservice = inject(Supaservice);
  const router = inject(Router);
  const { data, error } = await supaservice.getCurrentUser();

  if (error || !data?.user) {
    return router.createUrlTree(['/home']);
  }

  return true;
};
