import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { SyncService } from '../services/sync.service';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get('datos-offline')
  obtenerDatosOffline(@Query('idEmpresa') idEmpresa: number) {
    return this.syncService.obtenerDatosOffline(idEmpresa);
  }

  @Get('productos-actualizados')
  getProductosActualizados(
    @Query('desde') desde: string,
    @Query('idEmpresa') idEmpresa: number
  ) {
    return this.syncService.getProductosActualizados(new Date(desde), idEmpresa);
  }

  @Post('sincronizar-movimientos')
  sincronizarMovimientos(@Body() movimientos: any[]) {
    return this.syncService.sincronizarMovimientos(movimientos);
  }
}