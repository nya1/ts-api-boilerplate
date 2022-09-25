import 'reflect-metadata';
import { app } from './app';
import { Database } from './database';
import { logger } from './util/logger';

const port = process.env.PORT || 3000;

Database()
  .initialize()
  .then(() => {
    app.listen(port, () =>
      logger.info(`listening at http://localhost:${port}`)
    );
  })
  .catch((err) => {
    logger.error('unable to connect to database', err);
  });
