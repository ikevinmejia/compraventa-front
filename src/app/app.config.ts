import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEs from '@angular/common/locales/es';
import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { MessageService } from '@openng/optimus-ui/api';
import { provideOptimus } from '@openng/optimus-ui/config';
import { DialogService } from '@openng/optimus-ui/dynamicdialog';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { tokenInterceptor } from './core/interceptors/token.interceptor';
import { MyPreset } from './theme/my-preset';

registerLocaleData(localeEs, 'es-CO');

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-CO' },
    DialogService,
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

    // Servicio para los toast
    MessageService,

    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    // Primero se consulta la API simulada; las demás peticiones continúan hacia el servidor.
    provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor])),
  ],
};
