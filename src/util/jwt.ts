import { sign, SignOptions, verify } from 'jsonwebtoken';
import { getConfig } from './config';

export function signJwt<T>(data: T, options?: SignOptions) {
  const config = getConfig();
  return sign(data as T & object, config.JWT_SECRET_KEY, options);
}

export function verifyJwt(token: string) {
  const config = getConfig();
  return verify(token, config.JWT_SECRET_KEY);
}
