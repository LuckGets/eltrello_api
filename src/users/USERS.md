# USER

## User Controller

## User Service

This part is about the service which have usecases to do with User domain.
We are using the [UsersRepository](./infrastructure/users.repository.ts) to handle every task which have to deal with the data which related to the User Domain entity.

### Lists of test to Satisfy

- create an user instance.
-

## User Repository

### Document-User-Persistence

As using mongoDB database which is document-model, we provide this [DocumentUser](./infrastructure/document/users.repository.ts) class to collect the persistence data for the User entity.

### Lists of test to satisfy

- should create a new instance of user, save to database and return a User domain entity
