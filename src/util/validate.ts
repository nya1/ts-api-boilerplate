import { validate as classValidatorValidate } from 'class-validator';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export async function validate<T>(
  userInput: unknown,
  validationClass: ClassConstructor<T>
) {
  // transform unknown object to class
  const inputClass = plainToInstance(validationClass, userInput);

  // validate using decorators defined in `validationClass` class
  const validationErrors = await classValidatorValidate(
    inputClass as T & object,
    {
      // throws if extra fields are found
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      // This will strip all properties that don't have any decorators.
      // https://github.com/typestack/class-validator#whitelisting
      whitelist: true
    }
  );

  // throw validation errors if any,
  // it will be picked up by the centralized error handler
  if (validationErrors.length > 0) {
    throw validationErrors;
  }

  // return after validation
  return inputClass;
}
