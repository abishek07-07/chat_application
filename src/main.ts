import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Swagger } from './utils/swagger/swagger';
import { HttpExceptionFilter } from './filters/ExceptionFilter';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from './pipes/validation.pipe';
import dotenv, { configDotenv } from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(logger);
  await Swagger(app);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
