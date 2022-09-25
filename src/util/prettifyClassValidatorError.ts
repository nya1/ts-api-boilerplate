import { ValidationError } from 'class-validator';

/**
 * from class validator error return a formatted object to produce
 * a more prettier errors
 * @example
 * ```
 * console.log(prettifyClassValidatorError(validationErrorFromClassValidator))
 * [
        {
            "where": "body",
            "field": "isDone",
            "reasons": [
                "must be a boolean value"
            ]
        }
   ]
 * ```
 */
export function prettifyClassValidatorError(err: ValidationError[]) {
  const validationErrorList: ValidationError[] = err;
  const prettyErrors: {
    field: string;
    reasons: string[];
    where: 'body';
  }[] = [];

  let errorsToProcess: ValidationError[] = validationErrorList;
  // loop each error, go deeper if needed and format error
  while (errorsToProcess.length !== 0) {
    const thisValidationError = errorsToProcess.pop();
    if (typeof thisValidationError === 'undefined') {
      continue;
    }
    const childrenElem = thisValidationError?.children;
    if (childrenElem) {
      errorsToProcess = errorsToProcess.concat(
        // add prefix for nested fields
        childrenElem.map((v) => {
          v.property = `${thisValidationError.property}.${v.property}`;
          return v;
        })
      );
    }

    if (typeof thisValidationError.constraints === 'undefined') {
      continue;
    }

    const reasonList: string[] = [];
    const fieldName = thisValidationError.property;
    const decoratorFailed: string[] = Object.keys(
      thisValidationError.constraints || {}
    );
    for (const thisContraint of decoratorFailed) {
      reasonList.push(
        thisValidationError.constraints?.[thisContraint]
          .replace(fieldName, '')
          .trim() || ''
      );
    }

    prettyErrors.push({
      where: 'body',
      field: fieldName,
      reasons: reasonList
    });
  }

  return prettyErrors;
}
