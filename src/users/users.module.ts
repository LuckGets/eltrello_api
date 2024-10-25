import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DocumentUserModule } from './infrastructure/document/document-user.module';
import { CryptoModule } from '../utils';
import { UsersController } from './users.controller';

// if using new model or database you can change Document to Relational module or any else.
const infraStructurePersistenceModule = DocumentUserModule;

@Module({
  imports: [infraStructurePersistenceModule, CryptoModule],
  providers: [UsersService],
  exports: [UsersService, infraStructurePersistenceModule],
  controllers: [UsersController],
})
export class UserModule {}
