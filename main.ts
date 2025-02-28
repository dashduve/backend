import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Seguridad y optimización
  app.use(helmet());
  app.use(compression());
  
  // Habilitar CORS para PWA
  app.enableCors({
    origin: configService.get('app.corsOrigins', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Prefijo global
  app.setGlobalPrefix('api');
  
  const port = configService.get('app.port', 3000);
  await app.listen(port);
  console.log(`Aplicación ejecutándose en: http://localhost:${port}`);
}
bootstrap();