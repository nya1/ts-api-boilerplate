import 'reflect-metadata';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config(); // load .env
import { User } from '../src/entities/user';
import { Database } from '../src/database';
import { UserService } from '../src/services/user';
import { iocContainer } from '../src/ioc';

/**
 * db initialization
 * script used to automatically create the tables
 * that we have defined (src/entity)
 *
 * intended usage is local
 */
async function main() {
  const userService = iocContainer.get(UserService);

  console.log('connecting to db...');
  const datasource = await Database().initialize();

  console.log('initializing the database...');
  await datasource.synchronize(true);

  // adding a test user
  const pass = 'password';
  const userToCreate: Partial<User> = {
    fullName: 'Test User',
    email: 'test@example.com'
  };
  console.log(`going to create new user with password=${pass}`, userToCreate);
  const userCreateRes = await userService.create(userToCreate, pass);
  console.log('user created', userCreateRes);

  // close db connection
  await datasource.destroy();

  return;
}

main()
  .then(() => {
    console.log('completed successfully');
  })
  .catch((err) => {
    console.error('failed to initialize db', err);
  });
