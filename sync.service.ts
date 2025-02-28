import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Inventario } from '../../inventario/entities/inventario.entity';
import { MovimientoInventario } from '../../movimientos/entities/movimiento.entity';

@Injectable()
export class SyncService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(MovimientoInventario)
    private movimientosRepository: Repository<MovimientoInventario>,
  ) {}

  /**
   * Obtiene los productos actualizados desde una fecha dada
   */
  async getProductosActualizados(desde: Date, idEmpresa: number): Promise<Producto[]> {
    return this.productosRepository.find({
      where: {
        ultima_actualizacion: { $gte: desde },
        id_empresa: idEmpresa
      }
    });
  }

  /**
   * Sincroniza movimientos de inventario creados offline
   */
  async sincronizarMovimientos(movimientos: any[]): Promise<MovimientoInventario[]> {
    const movimientosCreados = [];
    
    for (const movimiento of movimientos) {
      const nuevoMovimiento = this.movimientosRepository.create(movimiento);
      const guardado = await this.movimientosRepository.save(nuevoMovimiento);
      movimientosCreados.push(guardado);
    }
    
    return movimientosCreados;
  }

  /**
   * Obtiene datos básicos para trabajar offline
   */
  async obtenerDatosOffline(idEmpresa: number) {
    const productos = await this.productosRepository.find({
      where: { id_empresa: idEmpresa }
    });

    const inventario = await this.inventarioRepository.find({
      where: { id_empresa: idEmpresa }
    });

    return {
      productos,
      inventario,
      timestamp: new Date(),
    };
  }
}