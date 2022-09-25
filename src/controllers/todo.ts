import { provideSingleton } from '../util/provideSingleton';
import {
  Route,
  Get,
  Post,
  Tags,
  Body,
  Request,
  Put,
  Path,
  Security,
  Query
} from 'tsoa';
import { NewTodoRequest, UpdateTodoRequest } from '../requests/todo';
import { TodoService } from '../services/todo';
import { inject } from 'inversify';
import { Request as HttpRequest } from 'express';
import { getUserOrThrow } from '../services/auth/helper';
import { SecurityJwtName } from '../services/auth';

@Security(SecurityJwtName) // jwt needed
@Route('/todo') // base path for controller
@Tags('Todo') // openapi section for controller endpoints
@provideSingleton(TodoController) // auto inject
export class TodoController {
  // inject needed services so we can use in methods
  constructor(@inject(TodoService) private todoService: TodoService) {}

  /**
   * list and search todos
   * @param isDone filter by isDone field
   * @param partialContent filter by searching for a word in the content field
   */
  @Get('/')
  async list(
    @Request() request: HttpRequest,
    @Query('isDone') isDone?: boolean,
    @Query('partialContent') partialContent?: string
  ) {
    // load authenticated user
    const user = getUserOrThrow(request);

    // pass to service
    const todoList = await this.todoService.list(user, {
      isDone,
      partialContent
    });

    return {
      result: todoList,
      count: todoList.length
    };
  }

  /**
   * create new todo
   */
  @Post('/')
  async create(
    @Request() request: HttpRequest,
    @Body() body: NewTodoRequest // accept a body of NewTodoRequest shape (needed for openapi)
  ) {
    // load authenticated user
    const user = getUserOrThrow(request);

    // validate body
    const validatedBody = await NewTodoRequest.validate(body);

    // pass to service
    const newTodo = await this.todoService.new(user, validatedBody);

    return {
      result: {
        id: newTodo.id
      }
    };
  }

  /**
   * update todo
   * @param todoId todo identifier returned in creation (or list)
   */
  @Put('/{id}')
  async update(
    @Request() request: HttpRequest,
    @Path('id') todoId: number,
    @Body() body: UpdateTodoRequest // accept a body of NewTodoRequest shape (needed for openapi)
  ) {
    // load authenticated user
    const user = getUserOrThrow(request);

    // validate body
    const validatedBody = await UpdateTodoRequest.validate(body);

    // pass to service
    const todoUpdateRes = await this.todoService.update(
      user,
      todoId,
      validatedBody
    );

    return {
      success: todoUpdateRes
    };
  }
}
