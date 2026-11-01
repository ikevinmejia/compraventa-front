import { Routes } from '@angular/router';

export default [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/car-list/car-list').then((m) => m.CarList),
      },
      {
        path: ':id',
        loadComponent: () => import('./pages/car-detail/car-detail').then((m) => m.CarDetail),
        children: [
          { path: '', redirectTo: 'datos-basicos', pathMatch: 'full' },
          {
            path: 'datos-basicos',
            loadComponent: () => import('./pages/car-basic/car-basic').then((m) => m.CarBasic),
          },
          {
            path: 'mecanica',
            loadComponent: () =>
              import('./pages/car-mechanical/car-mechanical').then((m) => m.CarMechanical),
          },
          {
            path: 'cosmetica',
            loadComponent: () =>
              import('./pages/car-cosmetic/car-cosmetic').then((m) => m.CarCosmetic),
          },
          {
            path: 'legal',
            loadComponent: () => import('./pages/car-legal/car-legal').then((m) => m.CarLegal),
          },
        ],
      },
    ],
  },
] as Routes;
