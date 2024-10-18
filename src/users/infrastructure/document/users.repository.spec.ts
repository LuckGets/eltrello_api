import { Test } from '@nestjs/testing';
import { UserSchemaClass } from './entities/user.schema';
import { DomainEntityDto } from '../../dto';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../domain/user';
import { UsersDocumentRepository } from './users.repository';
import { UserMapper } from './mappers/user.mapper';
import { AuthProvidersEnum } from '../../../auth/auth-providers.enum';
import { Document, Model } from 'mongoose';

jest.mock('./mappers/user.mapper');

describe('Document users repository', () => {
  let documentUserRepo: UsersDocumentRepository;

  let usersModelMock: jest.Mocked<Model<UserSchemaClass>>;
  let saveFnMock: jest.Mock = jest.fn();

  // mock the constant data
  const mockExisitingEmail = 'johndoe@mail.com';
  const mockExistingID = 'generated-id';

  // mock the user which save to database.
  const mockSavedUser: Partial<Document> & UserSchemaClass = {
    _id: mockExistingID,
    username: 'john doe',
    email: mockExisitingEmail,
    password: '123456',
    provider: AuthProvidersEnum.email,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
    save: jest.fn(),
  };

  function prepare(): User {
    const domainUser = new User();

    domainUser.id = 1;
    domainUser.email = mockExisitingEmail;
    domainUser.username = 'john doe';
    domainUser.password = '123456';
    domainUser.provider = AuthProvidersEnum.email;

    (UserMapper.toPersistence as jest.Mock).mockReturnValue(mockSavedUser);
    (UserMapper.toDomain as jest.Mock).mockReturnValue(domainUser);
    return domainUser;
  }

  // mock the save function in Mongo document
  saveFnMock.mockResolvedValue(mockSavedUser);

  // mock the findOne function mock.
  const findOneFnMock = jest.fn().mockImplementation((query) => {
    if (query.email === mockExisitingEmail) {
      return mockSavedUser;
    } else if (query.id === mockExistingID) {
      return mockSavedUser;
    } else {
      return null;
    }
  });

  // mock the findById function mock.
  const findByIdFnMock = jest.fn().mockImplementation((id) => {
    if (id === mockExistingID) {
      return Promise.resolve(mockSavedUser);
    } else {
      return null;
    }
  });

  // mock the userModel to have save function
  usersModelMock = jest.fn().mockImplementation((domainEntityDto) => {
    return {
      save: saveFnMock,
    };
  }) as unknown as jest.Mocked<Model<UserSchemaClass>>;

  usersModelMock.findOne = findOneFnMock;
  usersModelMock.findById = findByIdFnMock;
  beforeAll(async () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create method', () => {
    it('should create a new instance of user, save to database and return a User domain entity', async () => {
      const domainUser = prepare();
      const mockNewUser: DomainEntityDto = {
        email: 'johndoe@mail.com',
        username: 'john doe',
        password: '123456',
        provider: AuthProvidersEnum.email,
      };

      const result = await documentUserRepo.create(mockNewUser);

      expect(result).toEqual(domainUser);
      expect(result).toBeInstanceOf(User);
      expect(usersModelMock).toHaveBeenCalledWith(mockSavedUser);
      expect(saveFnMock).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    const domainUser = prepare();

    it('should return an instance of User if provide the correct email', async () => {
      const userObj = await documentUserRepo.findByEmail(mockExisitingEmail);

      expect(userObj).not.toBeNull();
      expect(userObj).toBeInstanceOf(User);

      expect(userObj).toStrictEqual(domainUser);
      expect(usersModelMock.findOne).toHaveBeenCalledWith({
        email: mockExisitingEmail,
      });
      expect(usersModelMock.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return null if provide the non-existing email', async () => {
      const mockFakeEmail = 'lololololol@mail.com';

      const nullUserObj = await documentUserRepo.findByEmail(mockFakeEmail);

      expect(nullUserObj).toBeNull();
      expect(nullUserObj).not.toBeInstanceOf(User);

      expect(usersModelMock.findOne).toHaveBeenCalledTimes(1);
      expect(usersModelMock.findOne).toHaveBeenCalledWith({
        email: mockFakeEmail,
      });
    });
  });

  describe('findById', () => {
    const domainUser = prepare();

    it('should return an instance of User if provided the correct ID', async () => {
      const userObj = await documentUserRepo.findById(mockExistingID);

      expect(userObj).toBeInstanceOf(User);
      expect(userObj).toStrictEqual(domainUser);
      expect(usersModelMock.findById).toHaveBeenCalledWith(mockExistingID);
    });

    it('should return null if provided the non-existing ID', async () => {
      const mockFakeId = 2229;

      const nullUserObj = await documentUserRepo.findById(mockFakeId);

      expect(nullUserObj).toBeNull();
      expect(nullUserObj).not.toBeInstanceOf(User);
      expect(usersModelMock.findById).toHaveBeenCalledWith(mockFakeId);
    });
  });
});
