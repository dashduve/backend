import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { DetallePedido } from './entities/detalle-pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { FilterPedidoDto } from './dto/filter-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido)
    private pedidosRepository: Repository<Pedido>,
    @InjectRepository(DetallePedido)
    private detallePedidoRepository: Repository<DetallePedido>,
    private dataSource: DataSource,
  ) {}

  async create(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear el pedido
      const pedido = this.pedidosRepository.create({
        id_empresa: createPedidoDto.id_empresa,
        fecha_entrega: createPedidoDto.fecha_entrega,
        estado: createPedidoDto.estado,
      });

      const savedPedido = await queryRunner.manager.save(pedido);

      // Crear los detalles del pedido
      if (createPedidoDto.detalles && createPedidoDto.detalles.length > 0) {
        const detalles = createPedidoDto.detalles.map(detalle => 
          this.detallePedidoRepository.create({
            id_pedido: savedPedido.id_pedido,
            id_producto: detalle.id_producto,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
          })
        );

        await queryRunner.manager.save(detalles);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedPedido.id_pedido);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error al crear el pedido: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(filterDto: FilterPedidoDto): Promise<Pedido[]> {
    const query = this.pedidosRepository.createQueryBuilder('pedido')
      .leftJoinAndSelect('pedido.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto');

    if (filterDto.id_empresa) {
      query.andWhere('pedido.id_empresa = :id_empresa', { id_empresa: filterDto.id_empresa });
    }

    if (filterDto.estado) {
      query.andWhere('pedido.estado = :estado', { estado: filterDto.estado });
    }

    if (filterDto.fecha_desde && filterDto.fecha_hasta) {
      query.andWhere('pedido.fecha_solicitud BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde: filterDto.fecha_desde,
        fechaHasta: filterDto.fecha_hasta,
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Pedido> {
    const pedido = await this.pedidosRepository.findOne({
      where: { id_pedido: id },
      relations: ['detalles', 'detalles.producto', 'empresa'],
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto): Promise<Pedido> {
    const pedido = await this.findOne(id);
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Actualizar los datos del pedido
      if (updatePedidoDto.fecha_entrega) {
        pedido.fecha_entrega = updatePedidoDto.fecha_entrega;
      }
      
      if (updatePedidoDto.estado) {
        pedido.estado = updatePedidoDto.estado;
      }

      await queryRunner.manager.save(pedido);

      // Si hay detalles nuevos, los actualizamos
      if (updatePedidoDto.detalles && updatePedidoDto.detalles.length > 0) {
        // Primero eliminamos los detalles existentes
        await queryRunner.manager.delete(DetallePedido, { id_pedido: id });

        // Luego creamos los nuevos detalles
        const detalles = updatePedidoDto.detalles.map(detalle => 
          this.detallePedidoRepository.create({
            id_pedido: id,
            id_producto: detalle.id_producto,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
          })
        );

        await queryRunner.manager.save(detalles);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error al actualizar el pedido: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const pedido = await this.findOne(id);
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Eliminar primero los detalles
      await queryRunner.manager.delete(DetallePedido, { id_pedido: id });
      
      // Luego eliminar el pedido
      await queryRunner.manager.delete(Pedido, { id_pedido: id });
      
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Error al eliminar el pedido: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
