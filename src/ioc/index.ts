import { Container } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';

// Create a new container tsoa can use
const iocContainer = new Container();

// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

// export according to convention
export { iocContainer };
