import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('Monsters CRUD REST API')
    .setDescription(
      'There are 2 hardcoded users:"Bored Mike" with the password "MIKE" and "Everyone" with the password "public"\n' +
        'You can use the "Try it out" button to authenticate and test the endpoints.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Authenticate with Bored Mike or Everyone and get the access token',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'swaggerBearerAuth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup('/', app, document);

  await app.listen(3000);
}
bootstrap();
