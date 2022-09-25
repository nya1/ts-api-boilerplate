import { bcryptHash } from '../util/hash';
import { Database } from '../database';
import { User } from '../entities/user';
import { provideSingleton } from '../util/provideSingleton';
import { NewUserRequest } from '../requests/user';
import { AuthService } from './auth/auth';
import { inject } from 'inversify';
import { logger } from '../util/logger';

@provideSingleton(UserService)
export class UserService {
  constructor(@inject(AuthService) private authService: AuthService) {}

  // helper to get repository
  private get userRepository() {
    return Database().getRepository(User);
  }

  async create(user: Partial<User>, plainTextPsw: string) {
    const passwordHash = await bcryptHash(plainTextPsw);

    const entity = this.userRepository.create({
      email: user.email,
      fullName: user.fullName,
      passwordHash
    });
    logger.debug(entity, 'creating user');
    const res = await this.userRepository.save(entity);

    return res;
  }

  async createAndGenerateJwt(newUser: NewUserRequest) {
    // create new user in db
    const createUserRes = await this.create(newUser, newUser.password);
    // generate jwt
    const jwt = this.authService._signJwt(createUserRes);

    return {
      id: createUserRes.id,
      jwt
    };
  }
}
