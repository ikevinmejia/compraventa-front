import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../../features/auth/models/auth.interface';
import { AuthService } from '../../features/auth/services/auth.service';
// Exige sesión
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() || inject(Router).createUrlTree(['/auth/login']);
};

// Exige rol (guard "fábrica")
export const roleGuard =
  (...roles: Role[]): CanActivateFn =>
  () => {
    const auth = inject(AuthService);
    console.log(auth.hasRole(...roles), `rol: ${roles}`);
    return auth.hasRole(...roles) || inject(Router).createUrlTree(['/notfound']);
  };

// Evita que alguien ya logueado vuelva al login
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return !auth.isAuthenticated() || inject(Router).createUrlTree(['/admin/dashboard']);
};
