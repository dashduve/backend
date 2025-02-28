import { IsNotEmpty, IsNumber, IsDateString, IsEnum, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoPedido } from '../entities/pedido.entity';

export class CreateDetallePedidoDto {
  @IsNumber()
  @IsNotEmpty()
  id_producto: number;

  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsNumber()
  @IsNotEmpty()
  precio_unitario: number;
}

export class CreatePedidoDto {
  @IsNumber()
  @IsNotEmpty()
  id_empresa: number;

  @IsOptional()
  @IsDateString()
  fecha_entrega?: Date;

  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetallePedidoDto)
  detalles: CreateDetallePedidoDto[];
}