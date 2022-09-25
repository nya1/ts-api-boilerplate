import pino from 'pino';
import { Logger } from 'typeorm';
import { isDevEnv, serviceName } from './config';

// only during development
const enablePrettyPrint = isDevEnv;

let transport: pino.TransportSingleOptions | undefined = undefined;

if (enablePrettyPrint) {
  transport = {
    target: 'pino-pretty'
  };
}

const logLevel: pino.Level = isDevEnv ? 'debug' : 'info';

export const logger = pino({
  name: serviceName,
  transport,
  level: logLevel
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
