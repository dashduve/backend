import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReporteDto {
  @ApiProperty({ description: 'ID de la empresa asociada al reporte' })
  @IsNumber()
  id_empresa: number;

  @ApiProperty({ description: 'Tipo de reporte', enum: ['Inventario', 'Ventas', 'Perdidas'] })
  @IsEnum(['Inventario', 'Ventas', 'Perdidas'])
  tipo: string;

  @ApiProperty({ description: 'Ruta del archivo PDF generado', required: false })
  @IsOptional()
  @IsString()
  archivo_pdf?: string;

  @ApiProperty({ description: 'ID del usuario que genera el reporte' })
  @IsNumber()
  id_usuario: number;
}
