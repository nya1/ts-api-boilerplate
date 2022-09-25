import { Request as HttpRequest } from 'express';
import createHttpError from 'http-errors';
import { AuthenticatedUser, SecurityJwtName } from '.';
import { iocContainer } from '../../ioc';
import { AuthService } from './auth';

const authService = iocContainer.get(AuthService);

// middleware used by tsoa (tsoa.json)
export async function expressAuthentication(
  request: HttpRequest,
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _scopes?: string[]
): Promise<AuthenticatedUser> {
  // based on the type of authorization required by the
  // endpoint load and validate the token/key
  if (securityName === SecurityJwtName) {
    // load jwt from header
    const authHeader = request.headers['authorization'];
    const bearerToken = authHeader?.split('Bearer ')?.[1];
    if (!bearerToken) {
      throw new createHttpError.Unauthorized(
        "expected 'authorization' header to be populated with a bearer token"
      );
    }

    let authUser: AuthenticatedUser;
    try {
      // load user and create authenticated user
      const userLoaded = authService.verify(bearerToken);
      authUser = new AuthenticatedUser(userLoaded);
    } catch (err) {
      const reason = err instanceof Error ? err.message : '';
      throw new createHttpError.Unauthorized(`invalid jwt provided: ${reason}`);
    }

    // return allows to user to be available to the next middlewares/endpoints
    return Promise.resolve(authUser);
  } else {
    // this should never happen, it means that you are using a new security name that is not handled here
    throw new createHttpError.InternalServerError(
      `unexpected ${securityName} auth type`
    );
  }
}
