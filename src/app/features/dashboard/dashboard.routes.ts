import { Routes } from '@angular/router';
import { DashboardLayout } from './layout/dashboard-layout/dashboard-layout';

export default [
  {
    path: '',
    component: DashboardLayout,
    // children: [
    //   { path: '/', loadComponent: () => import('./pages/login/login').then((m) => m.Login) },
    //   {
    //     path: 'register',
    //     loadComponent: () => import('./pages/register/register').then((m) => m.Register),
    //   },
    // ],
  },
] as Routes;
