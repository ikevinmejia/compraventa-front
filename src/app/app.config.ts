import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { provideOptimus } from '@openng/optimus-ui/config';
import { routes } from './app.routes';
import { MyPreset } from './theme/my-preset';
export const appConfig: ApplicationConfig = {
  providers: [
    provideOptimus({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.dark',
          cssLayer: {
            name: 'optimus',
            order: 'theme, base, optimus',
          },
        },
      },
    }),

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
  ],
};
