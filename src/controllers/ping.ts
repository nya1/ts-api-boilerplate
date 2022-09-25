import { provideSingleton } from '../util/provideSingleton';
import { Route, Get, Tags } from 'tsoa';

@Route('/ping') // base path for controller
@Tags('Ping') // openapi section for controller endpoints
@provideSingleton(PingController) // auto inject
export class PingController {
  /**
   * allows to ping endpoint
   */
  @Get('/')
  ping() {
    return {
      success: true,
      result: {
        nodeEnv: process.env.NODE_ENV,
        date: new Date()
      }
    };
  }
}
