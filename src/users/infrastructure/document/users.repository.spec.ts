import { Test } from '@nestjs/testing';
import { UserSchemaClass } from './entities/user.schema';
import { DomainEntityDto } from '../../dto';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../domain/user';
import { UsersDocumentRepository } from './users.repository';
import { UserMapper } from './mappers/user.mapper';
import { AuthProvidersEnum } from '../../../auth/auth-providers.enum';

jest.mock('./mappers/user.mapper');

describe('Document users repository', () => {
  let documentUserRepo: UsersDocumentRepository;
  let usersModelMock: jest.Mock;
  let saveFnMock: jest.Mock;

  const mockSavedUser = {
    _id: 'generated-id',
    username: 'john doe',
    email: 'johndoe@mail.com',
    password: '123456',
    provider: AuthProvidersEnum.email,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  };

  beforeEach(async () => {
    // mock the save function in Mongo document
    saveFnMock = jest.fn().mockResolvedValue(mockSavedUser);

    // mock the userModel to have save function
    usersModelMock = jest.fn().mockImplementation(() => ({
      save: saveFnMock,
    }));

    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersDocumentRepository,
        {
          provide: getModelToken(UserSchemaClass.name),
          useValue: usersModelMock,
        },
      ],
    }).compile();

    documentUserRepo = moduleRef.get<UsersDocumentRepository>(
      UsersDocumentRepository,
    );
  });

  it('should create a new instance of user, save to database and return a User domain entity', async () => {
    const mockNewUser: DomainEntityDto = {
      email: 'johndoe@mail.com',
      username: 'john doe',
      password: '123456',
      provider: AuthProvidersEnum.email,
    };

    const domainUser: User = {
      id: 1,
      email: 'johndoe@mail.com',
      username: 'john doe',
      password: '123456',
      provider: AuthProvidersEnum.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (UserMapper.toPersistence as jest.Mock).mockReturnValue(mockSavedUser);
    (UserMapper.toDomain as jest.Mock).mockReturnValue(domainUser);

    const result = await documentUserRepo.create(mockNewUser);

    expect(result).toEqual(domainUser);
    expect(usersModelMock).toHaveBeenCalledWith(mockSavedUser);
    expect(saveFnMock).toHaveBeenCalled();
  });
});
