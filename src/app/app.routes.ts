import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'notfound',
    loadComponent: () => import('./shared/components/notfound/notfound').then((m) => m.Notfound),
  },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes') },
  { path: '**', redirectTo: '/notfound' },
];
