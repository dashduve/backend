// create-producto.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsPositive, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiPropertyOptional({ example: '7501234567890' })
  @IsOptional()
  @IsString({ message: 'El código de barras debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El código de barras no puede exceder los 50 caracteres' })
  codigoBarras?: string;

  @ApiProperty({ example: 'Laptop HP Pavilion' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Laptop con procesador i5, 8GB RAM, 512GB SSD' })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'La categoría debe ser un número' })
  idCategoria?: number;

  @ApiProperty({ example: 8500 })
  @IsNotEmpty({ message: 'El precio de compra es requerido' })
  @IsNumber({}, { message: 'El precio de compra debe ser un número' })
  @IsPositive({ message: 'El precio de compra debe ser positivo' })
  precioCompra: number;

  @ApiProperty({ example: 10000 })
  @IsNotEmpty({ message: 'El precio de venta es requerido' })
  @IsNumber({}, { message: 'El precio de venta debe ser un número' })
  @IsPositive({ message: 'El precio de venta debe ser positivo' })
  precioVenta: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber({}, { message: 'El stock mínimo debe ser un número' })
  @Min(0, { message: 'El stock mínimo no puede ser negativo' })
  stockMinimo?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber({}, { message: 'El stock máximo debe ser un número' })
  @Min(0, { message: 'El stock máximo no puede ser negativo' })
  stockMaximo?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'La empresa es requerida' })
  @IsNumber({}, { message: 'La empresa debe ser un número' })
  idEmpresa: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber({}, { message: 'El proveedor debe ser un número' })
  idProveedor?: number;
}

// update-producto.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {}

// filter-producto.dto.ts
import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FilterProductoDto {
  @ApiPropertyOptional({ example: 'laptop' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idCategoria?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idProveedor?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  idEmpresa?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  limit?: number = 10;
}
