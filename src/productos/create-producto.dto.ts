import { IsNotEmpty, IsNumber, IsString, IsOptional, Min, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ example: '7501234567890' })
  @IsOptional()
  @IsString()
  codigo_barras?: string;

  @ApiProperty({ example: 'Monitor LED 24"' })
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Monitor LED Full HD 24 pulgadas marca XYZ' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 200 })
  @IsNotEmpty({ message: 'El precio de compra es requerido' })
  @IsNumber({}, { message: 'El precio de compra debe ser un número' })
  @IsPositive({ message: 'El precio de compra debe ser positivo' })
  precio_compra: number;

  @ApiProperty({ example: 250 })
  @IsNotEmpty({ message: 'El precio de venta es requerido' })
  @IsNumber({}, { message: 'El precio de venta debe ser un número' })
  @IsPositive({ message: 'El precio de venta debe ser positivo' })
  precio_venta: number;

  @ApiProperty({ example: 5 })
  @IsOptional()
  @IsNumber({}, { message: 'El stock mínimo debe ser un número' })
  @Min(0, { message: 'El stock mínimo no puede ser negativo' })
  stock_minimo?: number;

  @ApiProperty({ example: 100 })
  @IsOptional()
  @IsNumber({}, { message: 'El stock máximo debe ser un número' })
  @IsPositive({ message: 'El stock máximo debe ser positivo' })
  stock_maximo?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'El ID de categoría debe ser un número' })
  id_categoria?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'El ID de empresa debe ser un número' })
  id_empresa?: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'El ID de proveedor debe ser un número' })
  id_proveedor?: number;
}