import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { getConfig } from '../util/config';
import { logger, PinoTypeOrmLogger } from '../util/logger';

let _cachedDatabase: DataSource | undefined;

/**
 * returns datasource to use for all database operations,
 * using function to easily mock the function during tests
 */
export function Database() {
  if (!_cachedDatabase) {
    const config = getConfig();
    _cachedDatabase = new DataSource({
      type: 'postgres',
      host: config.POSTGRES_HOST || 'localhost',
      port: Number(config.POSTGRES_PORT) || 5432,
      username: config.POSTGRES_USER,
      password: config.POSTGRES_PASSWORD,
      database: config.POSTGRES_DB,
      synchronize: config.DB_AUTO_SYNC ? true : false,
      logging: true,
      logger: new PinoTypeOrmLogger(logger),
      // automatically load all entities
      entities: [resolve(__dirname, '../entities/**/*.{ts,js}')],
      subscribers: [],
      migrations: []
    });
  }

  return _cachedDatabase;
}
