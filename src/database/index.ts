import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { logger, PinoTypeOrmLogger } from '../util/logger';

let _cachedDatabase: DataSource | undefined;

/**
 * returns datasource to use for all database operations,
 * using function to easily mock the function during tests
 */
export function Database() {
  if (!_cachedDatabase) {
    _cachedDatabase = new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: process.env.DB_AUTO_SYNC ? true : false,
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
