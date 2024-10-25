import * as request from 'supertest';
import {
  APP_URL,
  TEST_EMAIL,
  TEST_PASSWORD,
  TEST_USERNAME,
} from './utils/constants';
import { RESTMethod } from '../src/utils/types';
import { CreateUserDto } from '../src/users/dto';
import { AuthProvidersEnum } from '../src/auth/auth-providers.enum';

describe('Users Module', () => {
  const app = APP_URL;
  const apiPrefix = process.env.API_PREFIX || '/api/v1';

  describe('Registration', () => {
    it(`should throw an Error if provide existing email : ${apiPrefix}/auth (${RESTMethod.POST})`, () => {
      const createUserDto: CreateUserDto = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        username: TEST_USERNAME,
        provider: AuthProvidersEnum.email,
      };
      return request(app)
        .post(`${apiPrefix}/auth`)
        .send(createUserDto)
        .expect(422);
    });
  });
});
