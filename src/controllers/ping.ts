import { provideSingleton } from '../util/provideSingleton';
import { Route, Get, Tags } from 'tsoa';
import { getConfig } from '../util/config';

@Route('/ping') // base path for controller
@Tags('Ping') // openapi section for controller endpoints
@provideSingleton(PingController) // auto inject
export class PingController {
  private config = getConfig();

  /**
   * allows to ping endpoint
   */
  @Get('/')
  ping() {
    return {
      success: true,
      result: {
        nodeEnv: this.config.NODE_ENV,
        date: new Date()
      }
    };
  }
}
