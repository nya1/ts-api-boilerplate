
# REST API with auto OpenAPI template

Quickly bootstrap your next project with the most up to date template. 
Included a sample todo app with jwt based authentication.

**Note: are you looking for another kind of setup/modules? [Create a ticket]() requesting your ideal setup and I will create a dedicated branch**

## Features

- Latest modules with Node 16+ and TypeScript
- Lint and formatting via ESLint + Prettier
- PostgreSQL as data storage (using [typeorm](https://github.com/typeorm/typeorm/))
- Automatically generate OpenAPI spec/documentation (thanks to [tsoa](https://github.com/lukeautry/tsoa/))
- Painless testing with Jest
  - [Unit and integration tests samples](test)
  - Helpers to automatically mock the database in memory per test suite (integration tests)
  - pre-configured VSCode Debugger
- Easy to use inversion of control with helper functions
- JWT-based authentication sample
- CI/CD with GitHub Actions
- Start your local in-memory database via one command `bash bootstrap.sh`
- Supports watch mode
- HTTP Rate limiter

## Quickstart

Make sure you are running at least Node v16 and you have yarn installed, to install the modules run:

```bash
yarn install
```

### Bootstrap the local database

Start PostgreSQL locally via docker and create the tables defined in `src/entities` via the following command:

```bash
bash bootstrap.sh
```

### Add new service

1. Create new file in `src/services/` e.g. `product.ts`
2. Create a class with your business logic

```ts
// file: src/services/product.ts

@provideSingleton(ProductService) // auto inject
export class ProductService {

  list() {
    // sample data, this might come from db
    return [
      {
        name: 'T-Shirt',
        quantity: 1
      }
    ];
  }
}
```

### Add new controller

1. create new file in `src/controllers/` e.g. `product.ts`
2. Create a class with tsoa decorators and inject `ProductService`

```ts
// file: src/controllers/product.ts

@Route('/product') // base path for controller
@Tags('Product') // openapi section for controller endpoints
@provideSingleton(ProductController) // auto inject
export class ProductController {

  constructor(
    // load the service defined before
    @inject(ProductService) productService: ProductService,
  ) {}

  /**
   * @summary list all products
   */
  @Get('/')
  listAllProducts() {
    // get products
    const productList = this.productService.list();

    return {
      count: productList.length,
      result: productList
    };
  }
}
```

### Start in watch mode

```bash
yarn dev
```

Your OpenAPI spec file located here: [build/swagger.json](build/swagger.json) should have a new section `Product` with one endpoint `/product/` with request and response defined based on the type returned in `listAllProducts`


## Directory structure

- src - source files
  - controllers - where we define external endpoints
  - services - internal business logic
  - entities - tables
  - requests - where we store the expected request data shape
  - util - helper functions
  - ioc - inversion of control helper/setup
  - database - contains helper constant `Database` to interact with the database
  - types - augment express typing
- scripts - helper scripts
- build - output of tsoa build, contains the output swagger.json
- dist - compiled source output (javascript)
