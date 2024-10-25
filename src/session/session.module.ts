import { Module } from '@nestjs/common';
import { DatabaseConfig, databaseConfig } from '../database';

const infraStructureDatabase = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase;

@Module({})
export class SessionModule {}
