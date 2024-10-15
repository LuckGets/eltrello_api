import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './domain/user';
import { CreateUserDto } from './dto';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { DocumentUserModule } from './infrastructure/document/document-user.module';

describe('Users service', () => {
  let service: UsersService;

  // database block
  const infraStructurePersistenceModule = DocumentUserModule;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [infraStructurePersistenceModule],
      providers: [UsersService],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a new instance of user', () => {
    const mockNewUser: User = {
      id: 1,
      username: 'John doe',
      email: 'johndoe@mail.com',
      password: '123456',
      provider: AuthProvidersEnum.email,
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };

    const mockCreateUser: CreateUserDto = {
      email: 'johndoe@mail.com',
      username: 'John doe',
      password: '123456',
    };

    const result = service.create(mockCreateUser);
    expect(result).toEqual(mockNewUser);
    // jest.spyOn(mockUserRepository, 'create');
  });
});
