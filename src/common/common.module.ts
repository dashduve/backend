import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncService } from './services/sync.service';
import { SyncController } from './controllers/sync.controller';
import { Producto } from '../productos/entities/producto.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { MovimientoInventario } from '../movimientos/entities/movimiento.entity';
import { NotificacionesService } from './services/notificaciones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Inventario, MovimientoInventario])
  ],
  providers: [SyncService, NotificacionesService],
  controllers: [SyncController],
  exports: [SyncService, NotificacionesService],
})
export class CommonModule {}