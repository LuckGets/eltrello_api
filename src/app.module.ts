import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import appConfig from './config/app.config';
import { databaseConfig, MongooseConfigService } from './database';
import { UserModule } from './users/users.module';

// const infraStrutureDatabase = (databaseConfig as DatabaseConfig).isDocumentDatabase ? MongooseModule.forRootAsync({}) : ORMModule

const infraStructureDatabase = MongooseModule.forRootAsync({
  useClass: MongooseConfigService,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      envFilePath: ['.env'],
    }),
    infraStructureDatabase,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
