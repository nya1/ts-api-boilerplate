import { fluentProvide } from 'inversify-binding-decorators';
import { interfaces } from 'inversify';

/**
 * helper to easily inject
 */
export const provideSingleton = function <T>(
  identifier: interfaces.ServiceIdentifier<T>
) {
  return fluentProvide(identifier).inSingletonScope().done();
};
