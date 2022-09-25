import { User } from '../../entities/user';
import { Database } from '../../database';
import { provideSingleton } from '../../util/provideSingleton';
import { bcryptCompare } from '../../util/hash';
import createHttpError from 'http-errors';
import { signJwt, verifyJwt } from '../../util/jwt';
import { omit } from 'lodash';

@provideSingleton(AuthService)
export class AuthService {
  get userRepository() {
    return Database().getRepository(User);
  }

  /**
   * with email and password return a new jwt
   */
  async login(email: string, plainPassword: string) {
    // use a generic error for all types of errors to not leak any informations
    const genericError = new createHttpError.BadRequest(
      `invalid email or password provided`
    );

    // find user by email
    const normalizedEmail = email.toLowerCase(); // standardize email
    const userFound: User | undefined = await this.userRepository
      .createQueryBuilder()
      .select('*')
      .where('email = :email', { email: normalizedEmail })
      .getRawOne();

    if (typeof userFound?.passwordHash === 'undefined') {
      throw genericError;
    }

    // verify password
    const passwordMatch = await bcryptCompare(
      plainPassword,
      userFound.passwordHash
    );
    if (!passwordMatch) {
      throw genericError;
    }

    // generate jwt
    const newJwt = this._signJwt(userFound);

    return {
      userFound,
      jwt: newJwt
    };
  }

  _signJwt(user: User) {
    return signJwt(omit(user, 'passwordHash'), {
      expiresIn: '1h' // expires in 1 hour
    });
  }

  /**
   * with a valid jwt as input return the decoded jwt data
   */
  verify(jwt: string) {
    const decoded = verifyJwt(jwt);
    if (typeof decoded !== 'object') {
      throw new Error('invalid jwt token');
    }
    return decoded;
  }
}
