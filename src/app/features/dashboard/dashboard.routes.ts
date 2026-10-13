import { Routes } from '@angular/router';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.Dashboard),
      },
      // {
      //   path: 'register',
      //   loadComponent: () => import('./pages/register/register').then((m) => m.Register),
      // },
    ],
  },
] as Routes;
