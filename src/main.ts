import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from './config/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // get all the Config which register in the ConfigModule
  const configService = app.get(ConfigService<AllConfigType>);

  // setting up swagger config option
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Eltrello_API')
    .setDescription('The eltrello api')
    .setVersion('1.0')
    .addTag('eltrello')
    .build();

  // buidling swagger document
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('handbook', app, document);

  // make app listern at port which register in the config module
  await app.listen(configService.getOrThrow('app.PORT', { infer: true }));
}
bootstrap();
