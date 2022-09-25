import { JwtPayload } from 'jsonwebtoken';
import { User } from '../../entities/user';

export const SecurityJwtName = 'jwt';

/**
 * helper class to authenticate user
 */
export class AuthenticatedUser {
  /**
   * raw jwt payload
   */
  readonly _rawJwtPayload: JwtPayload;

  /**
   * user data
   */
  readonly _user: User;

  /**
   * user id
   */
  readonly id: number;

  constructor(jwtDecoded: JwtPayload) {
    this._rawJwtPayload = jwtDecoded;

    this._user = {
      id: jwtDecoded.id,
      email: jwtDecoded.email,
      fullName: jwtDecoded.fullName,
      createdAt: jwtDecoded.createdAt
    };

    this.id = this._rawJwtPayload.id;
  }

  /**
   * serialize user
   */
  toJSON() {
    return {
      id: this.id,
      email: this._user.email,
      fullName: this._user.fullName
    };
  }
}
