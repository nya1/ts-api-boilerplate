import { resolve } from 'path';
import { DataSource } from 'typeorm';
import { logger, PinoTypeOrmLogger } from '../util/logger';

export function Database() {
  return new DataSource({
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
