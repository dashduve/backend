import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { FilterInventarioDto } from './dto/filter-inventario.dto';
import { StockProductoDto } from './dto/stock-producto.dto';
import { Producto } from '../productos/entities/producto.entity';
import { MovimientosService } from '../movimientos/movimientos.service';
import { AlertasService } from '../alertas/alertas.service';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private movimientosService: MovimientosService,
    private alertasService: AlertasService,
  ) {}

  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    const inventario = this.inventarioRepository.create(createInventarioDto);
    return await this.inventarioRepository.save(inventario);
  }

  async findAll(filterDto: FilterInventarioDto): Promise<Inventario[]> {
    const { fechaInicio, fechaFin, idEmpresa } = filterDto;
    
    let where: FindOptionsWhere<Inventario> = {};
    
    if (idEmpresa) {
      where.empresa = { id_empresa: idEmpresa };
    }
    
    if (fechaInicio && fechaFin) {
      where.fecha_actualizacion = Between(new Date(fechaInicio), new Date(fechaFin));
    }
    
    return await this.inventarioRepository.find({
      where,
      relations: ['empresa'],
    });
  }

  async findOne(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id_inventario: id },
      relations: ['empresa'],
    });
    
    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }
    
    return inventario;
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.findOne(id);
    const updated = Object.assign(inventario, updateInventarioDto);
    return await this.inventarioRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.inventarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }
  }

  async getStockByProducto(productoId: number): Promise<StockProductoDto> {
    const producto = await this.productoRepository.findOne({
      where: { id_producto: productoId },
      relations: ['categoria', 'empresa', 'proveedor'],
    });
    
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
    }
    
    // Calcular stock actual del producto basado en movimientos
    const stockActual = await this.movimientosService.calcularStockActual(productoId);
    
    // Verificar si el stock está por debajo del mínimo
    if (stockActual < producto.stock_minimo) {
      // Generar alerta de stock bajo
      await this.alertasService.crearAlertaStockBajo(producto, stockActual);
    }
    
    return {
      producto,
      stockActual,
      stockMinimo: producto.stock_minimo,
      stockMaximo: producto.stock_maximo,
      estado: this.determinarEstadoStock(stockActual, producto.stock_minimo, producto.stock_maximo),
    };
  }
  
  private determinarEstadoStock(stockActual: number, stockMinimo: number, stockMaximo: number): string {
    if (stockActual <= stockMinimo) {
      return 'Bajo';
    } else if (stockActual >= stockMaximo) {
      return 'Exceso';
    } else {
      return 'Normal';
    }
  }
  
  async actualizarStock(productoId: number, cantidad: number, tipo: string, motivo: string, usuarioId: number): Promise<StockProductoDto> {
    // Verificar si el producto existe
    const producto = await this.productoRepository.findOne({
      where: { id_producto: productoId },
    });
    
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
    }
    
    // Registrar el movimiento
    await this.movimientosService.create({
      producto: { id_producto: productoId },
      tipo_movimiento: tipo,
      cantidad,
      motivo,
      usuario: { id_usuario: usuarioId },
      costo_unitario: producto.precio_compra,
      ubicacion: 'Almacén principal', // Esto podría ser un parámetro adicional
    });
    
    // Retornar el stock actualizado
    return await this.getStockByProducto(productoId);
  }
}
