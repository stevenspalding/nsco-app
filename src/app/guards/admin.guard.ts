import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = getAuth();

  // We wrap this in a Promise to pause the route transition
  // until Firebase has definitively verified the user's session state.
  return new Promise<boolean>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Unsubscribe immediately so we only listen once per route change
      unsubscribe();

      if (user) {
        resolve(true); // User is logged in, allow access
      } else {
        router.navigate(['/admin/login']); // Not logged in, kick to login page
        resolve(false);
      }
    });
  });
};
