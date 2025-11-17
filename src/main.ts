import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: '*',
    allowedHeaders: '*',
    credentials: false,
  });
  const config = new DocumentBuilder()
    .setTitle('Trippi API')
    .setDescription('API for Trippi')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 8000);
  console.log(
    'Server is running on port http://localhost:' + (process.env.PORT ?? 8000),
  );
  console.log(
    'Docs are running on port http://localhost:' +
      (process.env.PORT ?? 8000) +
      '/docs',
  );
}
bootstrap();
