import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaClass } from './entities/user.schema';
import { UserRepository } from '../users.repository';
import { UsersDocumentRepository } from './users.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchemaClass.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    {
      provide: UserRepository,
      useClass: UsersDocumentRepository,
    },
  ],
  exports: [UserRepository],
})
export class DocumentUserModule {}
