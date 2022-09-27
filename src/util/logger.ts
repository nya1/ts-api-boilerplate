import pino from 'pino';
import { Logger } from 'typeorm';
import { getConfig } from './config';

const config = getConfig();

// only during development
const enablePrettyPrint = config.isDevEnv;

let transport: pino.TransportSingleOptions | undefined = undefined;

if (enablePrettyPrint) {
  transport = {
    target: 'pino-pretty'
  };
}

export const logger = pino({
  name: config.SERVICE_NAME,
  transport,
  level: config.LOG_LEVEL,
  // https://getpino.io/#/docs/api?id=base-object
  base: {
    pid: process?.pid,
    NODE_ENV: config.NODE_ENV
  }
});

export class PinoTypeOrmLogger implements Logger {
  constructor(private readonly logger: pino.Logger) {}

  logQuery(
    query: string,
    parameters?: unknown[]
    // _queryRunner?: QueryRunner
  ) {
    this.logger.debug(
      { query: normalizeQuery(query), parameters },
      'sql query'
    );
  }

  logQueryError(
    error: string,
    query: string,
    parameters?: unknown[]
    // _queryRunner?: QueryRunner
  ) {
    this.logger.error(
      { query: normalizeQuery(query), parameters, error },
      'failed sql query'
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: unknown[]
    // _queryRunner?: QueryRunner
  ) {
    this.logger.warn(
      { query: normalizeQuery(query), parameters, time },
      'slow sql query'
    );
  }

  logSchemaBuild(
    message: string
    // _queryRunner?: QueryRunner
  ) {
    this.logger.debug(message);
  }

  logMigration(
    message: string
    // _queryRunner?: QueryRunner
  ) {
    this.logger.debug(message);
  }

  log(
    level: 'log' | 'info' | 'warn',
    message: unknown
    // _queryRunner?: QueryRunner
  ) {
    switch (level) {
      case 'log':
      case 'info':
        this.logger.info(message);
        break;
      case 'warn':
        this.logger.warn(message);
        break;
    }
  }
}

function normalizeQuery(query: string) {
  return query.replace(/\s\s+/g, ' ').trim();
}
