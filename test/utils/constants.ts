import { AuthProvidersEnum } from '../../src/auth/auth-providers.enum';
import { User } from '../../src/users';

export const APP_URL = `http://localhost:${process.env.PORT}`;
export const TEST_EMAIL = 'johndoe@mail.com';
export const TEST_USERNAME = 'John Doe';
export const TEST_PASSWORD = 'abcd1234';
export const MOCK_ID = 1;
export const MOCK_EXISTING_USER = {
  id: MOCK_ID,
  email: TEST_EMAIL,
  password: TEST_PASSWORD,
  username: TEST_USERNAME,
  provider: AuthProvidersEnum.email,
  createdAt: new Date(Date.now()),
  updatedAt: new Date(Date.now()),
} as User;

export const NEW_USER_EMAIL = 'janedoe@mail.com';
export const NEW_USER_USERNAME = 'Jane Doe';
