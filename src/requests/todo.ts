import {
  IsString,
  IsNotEmpty,
  MaxLength,
  NotContains,
  IsOptional,
  IsBoolean
} from 'class-validator';
import { validate } from '../util/validate';

/**
 * expected body to create a new todo
 */
export class NewTodoRequest {
  /**
   * text content
   */
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @NotContains('example') // don't allow "example" in text
  content!: string;

  public static async validate(userInput: unknown) {
    const validateResult = await validate(userInput, NewTodoRequest);

    // here you can also add custom validation logic and throw any errors

    return validateResult;
  }
}

/**
 * expected body to update a todo
 */
export class UpdateTodoRequest {
  /**
   * text content
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @NotContains('example') // don't allow "example" in text
  content?: string;

  /**
   * true if todo is done
   */
  @IsOptional()
  @IsBoolean()
  isDone?: boolean;

  public static async validate(userInput: unknown) {
    const validateResult = await validate(userInput, UpdateTodoRequest);

    // here you can also add custom validation logic and throw any errors

    return validateResult;
  }
}
