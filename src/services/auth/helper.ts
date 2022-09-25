import { AuthenticatedUser } from '.';
import { Request as HttpRequest } from 'express';

/**
 * get user from http request or throw
 * user is automatically set by the auth middleware
 */
export function getUserOrThrow(request: HttpRequest): AuthenticatedUser {
  const user = 'user' in request ? request.user : undefined;
  if (typeof user?._rawJwtPayload === 'undefined') {
    throw new Error('expected a valid user');
  }

  return user;
}
