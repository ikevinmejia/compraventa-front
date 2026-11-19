import { Routes } from '@angular/router';

export default [
  {
    path: '',
    children: [
      {
        path: 'registrados',
        loadComponent: () =>
          import('./pages/car-registered/car-registered').then((m) => m.CarRegistered),
      },
      {
        path: 'publicados',
        loadComponent: () =>
          import('./pages/car-published/car-published').then((m) => m.CarPublished),
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
          {
            path: 'imagenes',
            loadComponent: () =>
              import('./components/car-image-uploader/car-image-uploader').then(
                (m) => m.CarImageUploader,
              ),
          },
        ],
      },
    ],
  },
] as Routes;
