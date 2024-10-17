import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './domain/user';
import { CreateUserDto } from './dto';
import { UserRepository } from './infrastructure/users.repository';
import { BcryptService, CryptoService } from '../utils/crypto/Bcrypt';
import { UnprocessableEntityException } from '@nestjs/common';
import { beforeEach } from 'node:test';

describe('Users service', () => {
  let service: UsersService;
  let cryptoService: CryptoService;

  let mockUserRepository: jest.Mocked<UserRepository>;
  // database block

  beforeAll(async () => {
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
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
  });

  describe('create method', () => {
    // Mock the data to pass in method
    let mockCreateUser: CreateUserDto;
    let mockExistingUser: User;
    beforeEach(() => {
      // Mock the user data
      mockCreateUser = {
        email: 'johndoe@mail.com',
        username: 'John doe',
        password: '123456',
      };

      // Mock the existing user
      mockExistingUser = new User();
      mockExistingUser.email = 'janedoe@mail.com';

      // Mock the user repo which is the dependencies of this service class.
    });

    it('should return a new instance of user', async () => {
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

    it('should throw an error "username already existing" if the username is existing', async () => {});
  });

  describe('findByEmail', () => {
    it('should return an instance of user if give the right email of exist user.', () => {});
  });
});
