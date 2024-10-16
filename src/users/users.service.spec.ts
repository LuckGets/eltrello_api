import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './domain/user';
import { CreateUserDto } from './dto';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { UserRepository } from './infrastructure/users.repository';
import { BcryptService, CryptoService } from '../utils/crypto/Bcrypt';

describe('Users service', () => {
  let service: UsersService;

  let mockUserRepository: jest.Mocked<UserRepository>;
  // database block

  // Mock new User
  const mockNewUser: User = {
    id: 1,
    username: 'John doe',
    email: 'johndoe@mail.com',
    password: '123456',
    provider: AuthProvidersEnum.email,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  };

  // Mock the DTO for creating
  const mockCreateUser: CreateUserDto = {
    email: 'johndoe@mail.com',
    username: 'John doe',
    password: '123456',
  };
  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
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

    service = moduleRef.get<UsersService>(UsersService);
  });

  it('should return a new instance of user', async () => {
    // Mock the create method to return an instance of User
    mockUserRepository.create.mockResolvedValue(mockNewUser);

    const result = await service.create(mockCreateUser);
    expect(result).toEqual(mockNewUser);

    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...mockCreateUser,
    });
  });

  it('should return an instance of User with hashed password', async () => {
    mockUserRepository.create.mockResolvedValue(mockNewUser);

    const result = await service.create(mockCreateUser);

    const bcrypt = new BcryptService();

    console.log(result.password, 'password');
    // assertion part
    expect(result.password).not.toEqual(mockNewUser.password);
    expect(bcrypt.compare(mockNewUser.password, result.password)).toBe(true);
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...mockCreateUser,
    });
  });
});
