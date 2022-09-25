import { provideSingleton } from '../util/provideSingleton';
import { NewTodoRequest, UpdateTodoRequest } from '../requests/todo';
import { AuthenticatedUser } from './auth';
import { Database } from '../database';
import { Todo } from '../entities/todo';
import createHttpError from 'http-errors';
import { FindOptionsWhere, ILike } from 'typeorm';
import { logger } from '../util/logger';

/**
 * filters available on todo (used in list)
 */
export interface FilterTodo {
  isDone?: boolean;
  /**
   * partial match on a string in content
   */
  partialContent?: string;
}

/**
 * business logic
 */
@provideSingleton(TodoService) // auto inject
export class TodoService {
  // helper to get repository
  get todoRepository() {
    return Database().getRepository(Todo);
  }

  async new(user: AuthenticatedUser, todoRequest: NewTodoRequest) {
    // compose new todo and save
    const newTodoCreated = await this.todoRepository.save({
      ...todoRequest,
      createdByUserId: user.id
    });

    return {
      id: newTodoCreated.id
    };
  }

  async update(
    user: AuthenticatedUser,
    todoId: number,
    validatedBody: UpdateTodoRequest
  ) {
    // find todo
    const todoFound = await this.todoRepository.findOne({
      where: {
        id: todoId,
        createdByUserId: user.id
      }
    });

    // check if found
    if (!todoFound) {
      throw new createHttpError.NotFound(`todo not found`);
    }

    logger.info({ validatedBody }, `updating todo ${todoId}`);

    // update
    await this.todoRepository.update(
      {
        id: todoId
      },
      validatedBody
    );

    return true;
  }

  async list(user: AuthenticatedUser, filter?: FilterTodo) {
    const queryOptions: FindOptionsWhere<Todo> = {
      createdByUserId: user.id // by default search only todo created by the user
    };

    // conditionally add filters if present
    if (typeof filter?.isDone !== 'undefined') {
      queryOptions.isDone = filter.isDone;
    }
    if (typeof filter?.partialContent !== 'undefined') {
      // perform ilike (case insensitive like) on content
      // this is safe and applied as a sql parameter
      queryOptions.content = ILike(`%${filter.partialContent}%`);
    }

    return this.todoRepository.find({
      where: queryOptions
    });
  }
}
