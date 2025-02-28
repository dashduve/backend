import { IsOptional, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { EstadoPedido } from '../entities/pedido.entity';

export class FilterPedidoDto {
  @IsOptional()
  @IsNumber()
  id_empresa?: number;

  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  @IsOptional()
  @IsDateString()
  fecha_desde?: string;

  @IsOptional()
  @IsDateString()
  fecha_hasta?: string;
}