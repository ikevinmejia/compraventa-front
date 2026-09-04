// 1. Aquí defines el nombre exacto de tus variables ocultas
declare interface Env {
  readonly NODE_ENV: string;
  readonly NG_APP_PRODUCTION: string;
}

// 2. Aquí le dices a TypeScript que las vas a usar mediante 'import.meta.env'
declare interface ImportMeta {
  readonly env: Env;
}
