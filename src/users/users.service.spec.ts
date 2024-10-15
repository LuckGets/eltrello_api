import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './domain/user';
import { CreateUserDto } from './dto';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { UserRepository } from './infrastructure/users.repository';

describe('Users service', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn(),
  };
  // database block

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a new instance of user', async () => {
    const mockNewUser: User = {
      id: 1,
      username: 'John doe',
      email: 'johndoe@mail.com',
      password: '123456',
      provider: AuthProvidersEnum.email,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    };

    const mockCreateUser: CreateUserDto = {
      email: 'johndoe@mail.com',
      username: 'John doe',
      password: '123456',
    };

    // Mock the create method to return an instance of User
    mockUserRepository.create.mockResolvedValue(mockNewUser);

    const result = await service.create(mockCreateUser);
    expect(result).toEqual(mockNewUser);

    expect(mockUserRepository.create).toHaveBeenCalledWith({
      ...mockCreateUser,
    });
  });
});
