import { Routes } from '@angular/router';
import { DashboardLayout } from './features/dashboard/layout/dashboard-layout/dashboard-layout';

export const routes: Routes = [
  {
    path: 'notfound',
    loadComponent: () => import('./shared/components/not-found/not-found').then((m) => m.Notfound),
  },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes') },

  // Zona administrativa

  {
    path: 'admin',
    component: DashboardLayout,
    // canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.routes') },
    ],
  },

  { path: '**', redirectTo: '/notfound' },
];
