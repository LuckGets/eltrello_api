import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './domain/user';
import { CreateUserDto } from './dto';
import { UserRepository } from './infrastructure/users.repository';
import { BcryptService, CryptoService } from '../utils/crypto/Bcrypt';
import { UnprocessableEntityException } from '@nestjs/common';

describe('Users service', () => {
  let service: UsersService;
  let cryptoService: CryptoService;

  let mockUserRepository: jest.Mocked<UserRepository>;
  // database block

  const mockEmail = 'johndoe@mail.com';
  const mockId = 1;
  const mockNewEmail = 'janedoe@mail.com';

  // Preparing the mock data
  function prepare(): {
    mockCreateUser: CreateUserDto;
    mockExistingUser: User;
  } {
    // Mock the data to pass in method
    const mockCreateUser: CreateUserDto = {
      email: mockNewEmail,
      username: 'John doe',
      password: '123456',
    };
    // Mock the existing user
    const mockExistingUser = new User();
    mockExistingUser.id = mockId;
    mockExistingUser.email = mockEmail;
    return { mockCreateUser, mockExistingUser };
  }

  beforeAll(async () => {
    try {
      const { mockCreateUser, mockExistingUser } = prepare();

      mockUserRepository = {
        create: jest.fn(),
        findByEmail: jest.fn(),
        findById: jest.fn(),
      };

      mockUserRepository.findByEmail.mockImplementation(
        async (email: User['email']) => {
          if (email === mockExistingUser.email) {
            return mockExistingUser;
          } else {
            return null;
          }
        },
      );

      mockUserRepository.findById.mockImplementation(async (id: User['id']) => {
        if (id === mockExistingUser.id) {
          return mockExistingUser;
        } else {
          return null;
        }
      });

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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
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
      const mockCreateDupeUser = {
        email: mockEmail,
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
    const { mockExistingUser } = prepare();
    it('should return an instance of user if give the right email of exist user.', async () => {
      const userObj = await service.findByEmail(mockEmail);

      expect(userObj).toBeInstanceOf(User);
      expect(userObj).toStrictEqual(mockExistingUser);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(mockEmail);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('should return null if provide the non-existent email', async () => {
      const nonExistMail = 'hahahaEiEI@mail.com';

      const nullUserObj = await service.findByEmail(nonExistMail);

      expect(nullUserObj).toBeNull();
      expect(nullUserObj).not.toBeInstanceOf(User);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(nonExistMail);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    const { mockExistingUser } = prepare();

    it('should return an instance of User if provide the correct and exisitng ID', async () => {
      const userObj = await service.findById(mockId);

      expect(userObj).toBeInstanceOf(User);
      expect(userObj).toStrictEqual(mockExistingUser);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockId);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should return null if provide the non-existing ID', async () => {
      const mockNonExistingId = 69;
      const nullUserObj = await service.findById(mockNonExistingId);

      expect(nullUserObj).toBeNull();
      expect(nullUserObj).not.toBeInstanceOf(User);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(
        mockNonExistingId,
      );
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });
  });
});
