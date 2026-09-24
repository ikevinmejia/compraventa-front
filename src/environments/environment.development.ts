export const environment = {
  production: import.meta.env.NG_APP_PRODUCTION === 'true', // Convierte el texto 'true' a booleano
  apiUrl: 'http://localhost:3000/api',
};
