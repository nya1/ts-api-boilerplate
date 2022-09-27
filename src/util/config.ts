import type { Level } from 'pino';
import packageJson from '../../package.json';

/**
 * describes what we have exposed under env
 */
export interface AppConfig {
  SERVICE_NAME: string;
  NODE_ENV: 'test' | 'development' | 'staging' | 'production';
  /**
   * true if we are running in a development env
   */
  isDevEnv: boolean;
  PORT?: number;
  LOG_LEVEL: Level;
  DB_AUTO_SYNC?: 0 | 1;
  POSTGRES_HOST?: string;
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_PORT: number;
  JWT_SECRET_KEY: string;
}

/**
 * helper to get a typed env based on the defined interface
 */
export function getConfig(): AppConfig {
  const fromEnv = process.env as unknown as AppConfig;

  // set fallbacks
  const nodeEnv = fromEnv?.NODE_ENV || 'development';
  const isDevEnv =
    nodeEnv === 'development' || nodeEnv === 'test' ? true : false;

  const serviceName: string =
    fromEnv?.SERVICE_NAME || packageJson?.name || 'server';

  const logLevel = fromEnv?.LOG_LEVEL || (isDevEnv ? 'debug' : 'info');

  return {
    ...fromEnv,
    isDevEnv,
    SERVICE_NAME: serviceName,
    LOG_LEVEL: logLevel
  };
}
