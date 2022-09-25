import type { AuthenticatedUser } from '../../services/auth';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}
