import { app } from '../../src/app';
import request from 'supertest';
import { getTestUser, setupDatabase, teardownDatabase, TestUserData } from '../helper';
import { NewTodoRequest } from '../../src/requests/todo';

describe('Integration: Todo HTTP API (manage todos)', () => {
  let testUserA: TestUserData;

  beforeAll(async () => {
    await setupDatabase();

    // create user
    testUserA = await getTestUser('userA');
  });

  afterAll(() => {
    return teardownDatabase();
  });

  it('list todo (empty)', async () => {
    const result = await request(app)
      .get('/todo')
      .set('Authorization', 'Bearer ' + testUserA.jwt);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty('result');
    expect(result.body.result).toHaveLength(0);
  });

  const todoToCreate: NewTodoRequest = {
    content: 'testing 123'
  };
  it('create new todo', async () => {
    const result = await request(app)
      .post('/todo')
      .set('Authorization', 'Bearer ' + testUserA.jwt)
      .send(todoToCreate);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty('result');
    expect(result.body.result).toHaveProperty('id');
  });

  it('list todo', async () => {
    const result = await request(app)
      .get('/todo/')
      .set('Authorization', 'Bearer ' + testUserA.jwt);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty('result');
    expect(result.body).toHaveProperty('count', 1);
    expect(result.body.result).toHaveLength(1);
    const firstTodo = result.body.result[0];
    expect(firstTodo).toHaveProperty('content', todoToCreate.content);
    expect(firstTodo).toHaveProperty('isDone', false);
    expect(firstTodo).toHaveProperty('createdAt');
    expect(firstTodo).toHaveProperty('updatedAt');
  });

  it('update first todo', async () => {
    const result = await request(app)
      .put('/todo/1')
      .set('Authorization', 'Bearer ' + testUserA.jwt)
      .send({
        isDone: true
      });

    expect(result.statusCode).toEqual(200);
    expect(result.body).toHaveProperty('success', true);
  });

  it('list todo after update', async () => {
    const result = await request(app)
      .get('/todo/')
      .set('Authorization', 'Bearer ' + testUserA.jwt);

    expect(result.statusCode).toEqual(200);
    expect(result.body.result).toHaveLength(1);
    const firstTodo = result.body.result[0];
    expect(firstTodo).toHaveProperty('content', todoToCreate.content);
    expect(firstTodo).toHaveProperty('isDone', true);
  });
});
