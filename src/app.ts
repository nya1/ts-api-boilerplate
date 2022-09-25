// load from .env file
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import express, {
  Response as HttpResponse,
  Request as HttpRequest,
  NextFunction as MiddlewareNextFn
} from 'express';
import bodyParser from 'body-parser';
import { RegisterRoutes } from '../build/routes';
import { ValidationError } from 'class-validator';
import createHttpError, { HttpError } from 'http-errors';
import helmet from 'helmet';
import { prettifyClassValidatorError } from './util/prettifyClassValidatorError';
import { FieldErrors, ValidateError } from 'tsoa';
import { logger } from './util/logger';
import { pinoHttp } from 'pino-http';

export const app = express();

// setup http logger
app.use(
  pinoHttp({
    logger,
    quietReqLogger: true,
    redact: ['req.headers.authorization'],
    customLogLevel: function (_req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'silent';
      }
      return 'info';
    },
    serializers: {
      res: (res: HttpResponse) => {
        const statusCode = res.statusCode;
        return {
          statusCode
        };
      }
    }
  })
);

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

app.use(helmet());

RegisterRoutes(app);

app.use(function notFoundHandler(_req: HttpRequest, res: HttpResponse) {
  res.status(404).send({
    message: 'Not Found'
  });
});

app.use(function errorHandler(
  err: unknown,
  _req: HttpRequest,
  res: HttpResponse,
  next: MiddlewareNextFn
): HttpResponse | void {
  // handle validation error from class-validator (eg. body requests)
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    const validationErrorList: ValidationError[] = err;
    const prettyErrors = prettifyClassValidatorError(validationErrorList);

    return res.status(400).json({
      message: 'Validation Failed',
      errors: prettyErrors
    });
  }

  // handle validation error from tsoa (eg. query params)
  if (err instanceof ValidateError) {
    const fields = Object.keys(err.fields);
    const prettyErrors = fields.map((fieldName) => {
      const tsoaError: FieldErrors['x'] & {
        from?: 'query' | 'path' | 'header';
      } = err.fields[fieldName];
      return {
        field: fieldName,
        where: tsoaError.from || 'unknown',
        reasons: [tsoaError.message]
      };
    });

    return res.status(400).json({
      message: 'Validation Failed',
      errors: prettyErrors
    });
  }

  // handle http exceptions
  if (createHttpError.isHttpError(err)) {
    const httpError = err as HttpError;
    return res.status(httpError.status).json({
      ...httpError.headers,
      message: httpError.message
    });
  }

  // handle plain errors or unexpected exceptions
  if (err instanceof Error) {
    logger.error(err, 'error during http request');
    return res.status(500).json({
      message: 'Internal Server Error'
    });
  }

  next();
});
