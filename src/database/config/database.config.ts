import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from './database.config.type';

export const databaseConfig = registerAs<DatabaseConfig>('database', () => {
  return {
    isDocumentDatabase: ['mongodb'].includes(process.env.DATABASE_TYPE ?? ''),
    url: process.env.DATABASE_URL,
    type: process.env.DATABASE_TYPE,
    port: process.env.DATABASE_PORT ?? '3306',
    name: process.env.DATABASE_NAME,
  };
});
