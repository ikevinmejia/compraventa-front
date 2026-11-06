export interface AppEnvironment {
  production: boolean;
  /** URL raíz del backend (sin la barra final). */
  apiUrl: string;
  /** Solo en desarrollo: intercepta la API y devuelve respuestas simuladas. */
  mockCatalogs: boolean;
}
