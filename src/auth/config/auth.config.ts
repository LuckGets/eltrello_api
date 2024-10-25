import { registerAs } from '@nestjs/config';
import { AuthConfig } from './auth.config.type';

export default registerAs<AuthConfig>('auth', () => {
  return {
    confirmEmailSecret: process.env.CONFIRM_EMAIL_SECRET,
    confirmEmailExpireTime: process.env.CONFIRM_EMAIL_EXPIRE_TIME,
  };
});
