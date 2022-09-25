import { app } from '../../src/app';
import request from 'supertest';
import { setupDatabase, teardownDatabase } from '../helper';
import { NewUserRequest } from '../../src/requests/user';
import { verifyJwt } from '../../src/util/jwt';

describe('Integration: User HTTP API (signup and login flow)', () => {
  beforeAll(() => {
    return setupDatabase();
  });

  afterAll(() => {
    return teardownDatabase();
  });

  const userData: NewUserRequest = {
    fullName: 'test',
    email: 'test@example.com',
    password: 'password123'
  };
  let USER_JWT: string; // populated during login

  it('signup', async () => {
    const result = await request(app).post('/user/signup').send(userData);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty('result');
    expect(result.body?.result).toHaveProperty('id');
    expect(result.body?.result).toHaveProperty('jwt');

    // verify the jwt that we got
    const jwtDecoded = verifyJwt(result.body.result.jwt);
    expect(jwtDecoded).toHaveProperty('email', userData.email);
  });

  it('login', async () => {
    const result = await request(app).post('/user/login').send({
      email: userData.email,
      password: userData.password
    });

    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty('result');
    expect(result.body?.result).toHaveProperty('jwt');
    USER_JWT = result.body.result.jwt;
  });

  it('get user info', async () => {
    const result = await request(app)
      .get('/user/')
      // set jwt header
      .set('Authorization', 'Bearer ' + USER_JWT);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty('email', userData.email);
  });

  it('refresh token', async () => {
    const result = await request(app)
      .post('/user/refresh')
      // set jwt header
      .set('Authorization', 'Bearer ' + USER_JWT);

    expect(result.statusCode).toEqual(200);
    expect(result.body?.result).toHaveProperty('jwt');
    // must be changed
    expect(result.body.result.jwt).not.toEqual(USER_JWT);

    // update jwt for later use
    USER_JWT = result.body.result.jwt;
  });

  it('get user info after jwt refresh', async () => {
    const result = await request(app)
      .get('/user/')
      // set jwt header
      .set('Authorization', 'Bearer ' + USER_JWT);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty('email', userData.email);
  });

});
