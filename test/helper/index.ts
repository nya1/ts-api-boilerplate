import { DataSource } from 'typeorm';
import { resolve } from 'path';
import * as dbFile from '../../src/database';
import { iocContainer } from '../../src/ioc';
import { UserService } from '../../src/services/user';
import { NewUserRequest } from '../../src/requests/user';

/**
 * database used during tests
 * initialize via setupDatabase fn and remove it via teardownDatabase fn
 */
const inMemoryDb = new DataSource({
  type: 'better-sqlite3',
  database: ':memory:',
  dropSchema: true,
  synchronize: true,
  logging: false,
  // load all entities
  entities: [resolve(__dirname, '../../src/entities/**/*.{ts,js}')]
});

/**
 * mock database with in-memory one
 */
export async function setupDatabase() {
  // connect
  await inMemoryDb.initialize();

  // mock
  const mock = jest.spyOn(dbFile, 'Database');
  mock.mockReturnValue(inMemoryDb);

  return inMemoryDb;
}

/**
 * remove any mocks to database and disconnects the in-memory database
 */
export async function teardownDatabase() {
  // disconnects
  await inMemoryDb.destroy();

  // clear mock
  const mock = jest.spyOn(dbFile, 'Database');
  mock.mockClear();

  return inMemoryDb;
}

export interface TestUserData {
  id: number;
  name: string;
  jwt: string;
  userData: NewUserRequest;
}

const userCache: { [name: string]: TestUserData } = {};
export async function getTestUser(name: string, options?: { noCache: boolean }): Promise<TestUserData> {
  if (!userCache[name] || options?.noCache === true) {
    const userService = iocContainer.get(UserService);
    const userData: NewUserRequest = {
      fullName: 'Test ' + name,
      email: 'test1111@example.com',
      password: '1234567890'
    };
    const userCreateRes = await userService.createAndGenerateJwt(userData);

    // eslint-disable-next-line require-atomic-updates
    userCache[name] = {
      id: userCreateRes.id,
      jwt: userCreateRes.jwt,
      name,
      userData
    }
  }

  return userCache[name];
}
