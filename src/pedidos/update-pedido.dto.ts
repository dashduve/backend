import { PartialType } from '@nestjs/mapped-types';
import { CreatePedidoDto } from './create-pedido.dto';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { EstadoPedido } from '../entities/pedido.entity';

export class UpdatePedidoDto extends PartialType(CreatePedidoDto) {
  @IsOptional()
  @IsDateString()
  fecha_entrega?: Date;

  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;
}
