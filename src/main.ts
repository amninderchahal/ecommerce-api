// Load .env
import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cors from 'cors'; 

async function bootstrap() {
  const port = 8080;
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.setGlobalPrefix('api');

  // Init swagger
  if (process.env.NODE_ENV !== 'PROD') {
    const options = new DocumentBuilder()
      .setTitle('eCommerce Api')
      .setDescription('API documentation for eCommerce Api')
      .setVersion('1.0')
      .addTag('eCommerce')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(port);
  console.log(`server started on port ${port}`);
}
bootstrap();
