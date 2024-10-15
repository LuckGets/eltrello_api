import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DocumentUserModule } from './infrastructure/document/document-user.module';

// if using new model or database you can change Document to Relational module or any else.
const infraStructurePersistenceModule = DocumentUserModule;

@Module({
  imports: [infraStructurePersistenceModule],
  providers: [UsersService],
  exports: [UsersService, infraStructurePersistenceModule],
})
export class UserModule {}
