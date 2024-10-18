import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './domain/user';
import { CreateUserDto } from './dto';
import { UserRepository } from './infrastructure/users.repository';
import { BcryptService, CryptoService } from '../utils/crypto/Bcrypt';
import { UnprocessableEntityException } from '@nestjs/common';
import { beforeEach, mock } from 'node:test';

describe('Users service', () => {
  let service: UsersService;
  let cryptoService: CryptoService;

  let mockUserRepository: jest.Mocked<UserRepository>;
  // database block

  beforeAll(async () => {
    try {
      mockUserRepository = {
        create: jest.fn(),
        findByEmail: jest.fn(),
        findById: jest.fn(),
      };

      const moduleRef: TestingModule = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: UserRepository,
            useValue: mockUserRepository,
          },
          {
            provide: CryptoService,
            useClass: BcryptService,
          },
        ],
      }).compile();

      // get the UserService from module
      service = moduleRef.get<UsersService>(UsersService);
      // get the cryptoService from module
      cryptoService = moduleRef.get<CryptoService>(CryptoService);
    } catch (err) {
      console.log(err);
    }
  });

  describe('create method', () => {
    // Preparing the mock data
    function prepare(): {
      mockCreateUser: CreateUserDto;
      mockExistingUser: User;
    } {
      // Mock the data to pass in method
      const mockCreateUser: CreateUserDto = {
        email: 'johndoe@mail.com',
        username: 'John doe',
        password: '123456',
      };
      // Mock the existing user
      const mockExistingUser = new User();
      mockExistingUser.email = 'janedoe@mail.com';
      return { mockCreateUser, mockExistingUser };
    }

    it('should return a new instance of user', async () => {
      const { mockCreateUser } = prepare();
      // Mock the create method to return an instance of User
      mockUserRepository.create.mockImplementation(async (data) => {
        const user = new User();
        user.email = data.email;
        user.password = data.password;
        user.username = data.username;
        return user;
      });

      const result = await service.create(mockCreateUser);
      expect(result).toBeInstanceOf(User);
    });

    it('should return an instance of User with hashed password', async () => {
      const { mockCreateUser } = prepare();
      const hashFn = jest.spyOn(cryptoService, 'hash');

      mockUserRepository.create.mockImplementation(async (data) => {
        const user = new User();
        user.id = 1;
        user.username = data.username;
        user.email = data.email;
        user.password = data.password;
        return user;
      });
      // Action
      const result = await service.create(mockCreateUser);
      // Assertion part
      expect(hashFn).toHaveBeenCalledWith(mockCreateUser.password);
      expect(result).toBeInstanceOf(User);
      expect(result.password).not.toEqual(mockCreateUser.password);

      // check the plain text password and
      const isMatch = await cryptoService.compare(
        mockCreateUser.password,
        result.password,
      );

      expect(isMatch).toBe(true);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...mockCreateUser,
        password: result.password,
      });
    });

    it('should throw an error "email already existing" if the email is existing when creating', async () => {
      const { mockExistingUser } = prepare();
      mockUserRepository.findByEmail.mockImplementation(
        async (email: User['email']) => {
          if (email === mockExistingUser.email) {
            return mockExistingUser;
          } else {
            return null;
          }
        },
      );

      const mockCreateDupeUser = {
        email: 'janedoe@mail.com',
        username: 'John doe',
        password: '123456',
      };

      try {
        await service.create(mockCreateDupeUser);
        fail(
          'Expected service.create to throw an UnprocessableEntityException',
        );
      } catch (err) {
        // Assert for error
        expect(err).toBeInstanceOf(UnprocessableEntityException);
        expect(err.response.errors.email).toEqual('email already exists');
      }

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        mockCreateDupeUser.email,
      );
    });
  });

  describe('findByEmail', () => {
    function prepare(): User {
      const mockExistingUser: User = new User();
      mockExistingUser.email = 'johndoe@mail.com';
      mockExistingUser.id = 1;

      // Mock the implementation of findByEmail
      mockUserRepository.findByEmail.mockImplementation(
        async (data: User['email']) => {
          if (data === mockExistingUser.email) {
            return mockExistingUser;
          } else {
            return null;
          }
        },
      );
      return mockExistingUser;
    }
    it('should return an instance of User if give the right email of exist user.', async () => {
      const mockExistingUser = prepare();

      const mockEmail = 'johndoe@mail.com';

      const userObj = await service.findByEmail(mockEmail);

      expect(userObj).toBeInstanceOf(User);
      expect(userObj).toStrictEqual(mockExistingUser);
      expect(userObj).not.toBeNull();

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
    });

    it('should return null if give the non-registered email', async () => {
      prepare();

      const mockNonExistEmail = 'janedoe@mail.com';

      const expectNullUserObj = await service.findByEmail(mockNonExistEmail);

      expect(expectNullUserObj).toBeNull();
      expect(expectNullUserObj).not.toBeInstanceOf(User);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        mockNonExistEmail,
      );
    });
  });

  describe('findById', () => {
    function prepare(): User {
      const mockExistingUser: User = new User();
      mockExistingUser.id = 1;
      mockExistingUser.username = 'John doe';
      // Mock the implementation of findByEmail
      mockUserRepository.findById.mockImplementation(
        async (data: User['id']) => {
          if (data === mockExistingUser.id) {
            return mockExistingUser;
          } else {
            return null;
          }
        },
      );
      return mockExistingUser;
    }

    it('should return an instance of User if give the correct ID', async () => {
      const mockExistingUser = prepare();

      const mockId = 1;

      const userObj = await service.findById(mockId);

      expect(userObj).toBeInstanceOf(User);
      expect(userObj).not.toBeNull();
      expect(userObj).toStrictEqual(mockExistingUser);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockId);
    });

    it('should return null if give the non-existent id', async () => {
      const mockExistingUser = prepare();

      const mockNonExistID = 69;

      const nullUserObj = await service.findById(mockNonExistID);

      expect(nullUserObj).toBeNull();
      expect(nullUserObj).not.toBeInstanceOf(User);
    });
  });
});
