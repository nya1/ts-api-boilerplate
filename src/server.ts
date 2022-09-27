// load from .env file
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import 'reflect-metadata';
import { getConfig } from './util/config';
import { app } from './app';
import { Database } from './database';
import { logger } from './util/logger';

const config = getConfig();

logger.debug(config, `config loaded`);

const port = config.PORT || 3000;

Database()
  .initialize()
  .then(() => {
    app.listen(port, () =>
      logger.info(`listening at http://localhost:${port}`)
    );
  })
  .catch((err) => {
    logger.error(err, 'unable to connect to database');
  });
