import packageJson from '../../package.json';

/**
 * describes what we have exposed under env
 */
export interface AppConfig {
  NODE_ENV?: 'development' | 'production';
  PORT?: number;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_PORT: number;
  JWT_SECRET_KEY: string;
}

export const isDevEnv: boolean = getConfig().NODE_ENV !== 'production';

export const serviceName: string =
  process.env.SERVICE_NAME || packageJson?.name || 'server';

/**
 * helper to wrap get typed config based on defined interface
 */
export function getConfig(): AppConfig {
  return process.env as unknown as AppConfig;
}
