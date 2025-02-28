import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilterReporteDto {
  @ApiProperty({ description: 'ID de la empresa', required: false })
  @IsOptional()
  @IsNumber()
  idEmpresa?: number;

  @ApiProperty({ description: 'Tipo de reporte', required: false, enum: ['Inventario', 'Ventas', 'Perdidas'] })
  @IsOptional()
  @IsEnum(['Inventario', 'Ventas', 'Perdidas'])
  tipo?: string;

  @ApiProperty({ description: 'Fecha de inicio para filtrar', required: false })
  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @ApiProperty({ description: 'Fecha de fin para filtrar', required: false })
  @IsOptional()
  @IsString()
  fechaFin?: string;

  @ApiProperty({ description: 'ID del usuario', required: false })
  @IsOptional()
  @IsNumber()
  idUsuario?: number;
}
