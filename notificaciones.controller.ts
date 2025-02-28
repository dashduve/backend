import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { NotificacionesService } from '../services/notificaciones.service';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return this.notificacionesService.getVapidPublicKey();
  }

  @Post('suscribir')
  @UseGuards(JwtAuthGuard)
  suscribir(@GetUser() user, @Body() subscription: any) {
    return this.notificacionesService.guardarSuscripcion(user.id_usuario, subscription);
  }
}