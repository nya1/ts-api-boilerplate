import { Transform } from 'class-transformer';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { validate } from '../util/validate';

export class LoginRequest {
  @Transform((u) => u?.value?.toLowerCase()) // standardize to lowercase
  @IsEmail()
  email!: string;

  /**
   * minimum 8 length
   */
  @IsString()
  @MinLength(8)
  password!: string;

  public static async validate(userInput: unknown) {
    const validateResult = await validate(userInput, LoginRequest);

    return validateResult;
  }
}

export class NewUserRequest extends LoginRequest {
  @IsString()
  @MaxLength(200)
  @MinLength(2)
  fullName!: string;

  public static async validate(userInput: unknown) {
    const validateResult = await validate(userInput, NewUserRequest);

    return validateResult;
  }
}
