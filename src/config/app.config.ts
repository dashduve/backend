import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'mySecretKey',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  environment: process.env.NODE_ENV || 'development',
}));