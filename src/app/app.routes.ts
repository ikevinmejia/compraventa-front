import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';
import { DashboardLayout } from './features/dashboard/layout/dashboard-layout/dashboard-layout';

export const routes: Routes = [
  {
    path: 'notfound',
    loadComponent: () => import('./shared/components/not-found/not-found').then((m) => m.Notfound),
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes'),
  },

  // Zona administrativa

  {
    path: 'admin',
    component: DashboardLayout,
    canActivate: [authGuard, roleGuard('admin', 'superuser')],
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes') },
      { path: 'autos', loadChildren: () => import('./features/cars/cars.routes') },
      {
        path: '**',
        loadComponent: () =>
          import('./shared/components/not-found/not-found').then((m) => m.Notfound),
      },
    ],
  },

  { path: '**', redirectTo: '/notfound' },
];
