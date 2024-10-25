# USER

## User Controller

The users controller is responsible for listen for the incoming HTTP request, validating the data and response back the resources the client are expected with provided data. The users path can see in Swagger API doc which can be see in

```env
server-ip:PORT/handbook
```

### Lists of test to satisfy.

## User Service

This class is responsible for handle any logic which have to deal with the usecase which associated with the User domain.
We are using the [UsersRepository](./infrastructure/users.repository.ts) to handle every task which have to deal with the data which related to the User Domain entity.

### Lists of test to satisfy

    - create method
        - should return a new instance of user
        - should return an instance of User with hashed password
        - should throw an error "email already existing" if the email is existing when creating

    - findByEmail method
        - should return an instance of user if give the right email of exist user.
        - should return null if provide the non-existent email

    - findById method
        - should return an instance of User if provide the correct and exisitng ID'
        - should return null if provide the non-existing ID

    - findManyWithPagination method
        - should return an Array lists of User instance
        - should return the List of User instance with pagination which provided by default
        - should skip the order of user if provide the number of skipping order to paginationOption
        - should give the same amount of instance of User if provide the limit number to paginationOption
        - should return the sorted List of User if provide the SortOptions

## User Repository

### Document-User-Persistence

As using mongoDB database which is document-model, we provide this [DocumentUser](./infrastructure/document/users.repository.ts) class to collect the persistence data for the User entity.

### Lists of test to satisfy

- should create a new instance of user, save to database and return a User domain entity
