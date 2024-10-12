import { registerAs } from '@nestjs/config';
import { AppConfig } from './app.config.type';

export default registerAs<AppConfig>('app', () => {
  return {
    PORT: Number(process.env.APP_PORT),
    apiPrefix: process.env.API_PREFIX,
  };
});
