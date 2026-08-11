import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Swagger } from './utils/swagger/swagger';
import { HttpExceptionFilter } from './filters/ExceptionFilter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from './pipes/validation.pipe';
import dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  app.enableCors({
    origin:
      process.env.NODE_ENV == 'development'
        ? 'http://localhost:8080'
        : process.env.CORS_ORIGIN,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
  });
  if (process.env.NODE_ENV == 'development') await Swagger(app);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
