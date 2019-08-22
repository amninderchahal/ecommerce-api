# eCommerce Api
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development with watch mode
$ npm run start

# build
$ npm run build # compiles application and outputs to dist folder

# dev server
$ pm2 delete all # delete previous application instances
$ npm run start:dev # build and start with pm2

# production server
$ pm2 delete all # delete previous application instances
$ npm run start:prod # build and start with pm2
```
#### To debug the application:
* Open with VS Code
* Go Debug > Start debugging

#### Swagger documentation
* Go to http://localhost:8080/swagger
* Please note that swagger documentation is not available for production server.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
