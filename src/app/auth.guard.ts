import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (!sessionStorage.getItem('user')) {
    // User is not authenticated, redirect to login page
    router.navigate(['/login']);
    alert('You must be logged in to access this page.');
    // Return false to prevent access to the route
    return false;
  }
  else{
    // User is authenticated, allow access to the route
    return true;
  }
};
