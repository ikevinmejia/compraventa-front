import { AppEnvironment } from './environment.model';

export const environment: AppEnvironment = {
  production: import.meta.env.NG_APP_PRODUCTION === 'true', // Convierte el texto 'true' a booleano
};
