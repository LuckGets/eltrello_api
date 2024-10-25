import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchemaClass } from 'src/users';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import {
  MOCK_EXISTING_USER,
  NEW_USER_EMAIL,
  NEW_USER_USERNAME,
  TEST_EMAIL,
  TEST_PASSWORD,
  TEST_USERNAME,
} from '../../test/utils/constants';
import { AuthProvidersEnum } from './auth-providers.enum';
import { BcryptService, CryptoService } from '../utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthConfig } from './config/auth.config.type';
import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthUserLoginDto } from './dto/auth-login.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let cryptoService: CryptoService;
  const mockNewId = 2;

  const mockJwtService = {
    signAsync: jest.fn().mockImplementation(async (data) => {
      return Promise.resolve(data);
    }),
  };

  const mockUsersService: jest.Mocked<Partial<UsersService>> = {
    create: jest.fn().mockImplementation(async (data: Partial<User>) => {
      if (data.email !== MOCK_EXISTING_USER.email) {
        const newUser = {
          id: mockNewId,
          email: data.email,
          username: data.username,
        } as User;
        return Promise.resolve(newUser);
      } else {
        throw new Error();
      }
    }),
    findByEmail: jest.fn().mockImplementation(async (email: User['email']) => {
      if (email === MOCK_EXISTING_USER.email) {
        return Promise.resolve(MOCK_EXISTING_USER);
      } else return null;
    }),
  };

  const mockConfigServiceData: AuthConfig = {
    confirmEmailExpireTime: '1d',
    confirmEmailSecret: 'SecERfGR',
  };
  const mockConfigService = {
    getOrThrow: function () {
      return mockConfigServiceData;
    },
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: CryptoService,
          useClass: BcryptService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    cryptoService = moduleRef.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const authRegisterDto: AuthRegisterDto = {
      email: NEW_USER_EMAIL,
      username: NEW_USER_USERNAME,
      password: TEST_PASSWORD,
    };

    it('should create an instance of User by using the data provided', async () => {
      await authService.register(authRegisterDto);

      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...authRegisterDto,
        provider: AuthProvidersEnum.email,
      });
    });

    it('should create an instance of user by using UsersService', async () => {
      await authService.register(authRegisterDto);

      expect(mockUsersService.create).toHaveBeenCalledTimes(1);
    });

    it('should using the jwt service once', async () => {
      await authService.register(authRegisterDto);
      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1);
    });

    it('should hash the userID to the payload before sent to confirmEmail', async () => {
      await authService.register(authRegisterDto);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: mockNewId },
        {
          expiresIn: mockConfigServiceData.confirmEmailExpireTime,
          secret: mockConfigServiceData.confirmEmailSecret,
        },
      );
    });
  });

  describe('login', () => {
    const authLoginUserDto: AuthUserLoginDto = {};

    beforeEach(function () {
      jest.clearAllMocks();
    });

    it('should check if the email already exist in the DB once', async () => {
      await authService.validateLogin(authLoginUserDto);

      expect(mockUsersService.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw an Error if the email is not registered in the DB', async () => {
      const nonExistUserDto = { ...authLoginUserDto, email: '696969@mail.com' };
      try {
        await authService.validateLogin(authLoginUserDto);
        fail(
          'Expected UsersService.findByEmail to throw an UnprocessableEntityException',
        );
      } catch (err) {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
        console.log(err);
      }
    });

    it('should compare the password provided and the password in the DB', async () => {
      await authService.validateLogin(authLoginUserDto);

      expect(cryptoService.compare).toHaveBeenCalledTimes(1);
      expect(cryptoService.compare).toHaveBeenCalledWith(
        authLoginUserDto.password,
      );
    });

    it('should throw an Unauthorized Error if the provided password does not match with the password registered', async () => {
      const wrongPasswordDto: AuthUserLoginDto = {
        ...authLoginUserDto,
        password: '69696969',
      };
      try {
        await authService.validateLogin(wrongPasswordDto);
        fail(
          'Expect authService.validateLogin to throw an UnauthorizedException',
        );
      } catch (err) {
        expect(err).toBeInstanceOf(UnauthorizedException);
      }
    });

    it.todo('should throw an Error if providers is not email');

    it('should create the session for user', async () => {});
  });
});
