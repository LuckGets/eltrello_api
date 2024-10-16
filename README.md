## ENV guide

```env
# API and Server config part
APP_PORT : number
API_PREFIX : string

# Database Part
DATABASE_TYPE : document or relation
DATABASE_PORT : number
DATABASE_NAME : string
DATABASE_URL : string

# Crypto
BCRYPT_SALT : number
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
