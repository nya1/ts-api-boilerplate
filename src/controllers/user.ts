import { inject } from 'inversify';
import { UserService } from '../services/user';
import {
  Get,
  Route,
  Tags,
  Request,
  Post,
  Security,
  NoSecurity,
  Body,
  Middlewares
} from 'tsoa';
import { provideSingleton } from '../util/provideSingleton';
import { Request as HttpRequest } from 'express';
import { SecurityJwtName } from '../services/auth';
import { LoginRequest, NewUserRequest } from '../requests/user';
import { AuthService } from '../services/auth/auth';
import { getUserOrThrow } from '../services/auth/helper';
import { hardRateLimiter } from '../util/rateLimiter';

@Security(SecurityJwtName) // to access this controller a valid jwt is needed
@Route('/user') // base path for controller
@Tags('User') // openapi section for controller endpoints
@provideSingleton(UserController) // auto inject
export class UserController {
  constructor(
    @inject(UserService) private userService: UserService,
    @inject(AuthService) private authService: AuthService
  ) {}

  @Get('/')
  me(@Request() request: HttpRequest) {
    return request.user;
  }

  /**
   * register new user, return also jwt token
   */
  @NoSecurity() // doesn't require authentication
  @Middlewares(hardRateLimiter())
  @Post('/signup')
  async signup(@Body() body: NewUserRequest) {
    // validate
    const validatedBody = await NewUserRequest.validate(body);

    const userCreateRes = await this.userService.createAndGenerateJwt(
      validatedBody
    );

    return {
      result: userCreateRes
    };
  }

  /**
   * login, get jwt token
   */
  @NoSecurity() // doesn't require authentication
  @Post('/login')
  async login(@Body() body: LoginRequest) {
    // validate
    const validatedBody = await LoginRequest.validate(body);

    const authRes = await this.authService.login(
      validatedBody.email,
      validatedBody.password
    );

    return {
      result: {
        jwt: authRes.jwt
      }
    };
  }

  /**
   * refresh the current jwt
   */
  @Middlewares(hardRateLimiter())
  @Post('/refresh')
  refresh(@Request() request: HttpRequest) {
    const authUser = getUserOrThrow(request);

    const jwt = this.authService._signJwt(authUser._user);

    return {
      result: {
        jwt
      }
    };
  }
}
