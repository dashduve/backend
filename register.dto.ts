import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty({ message: 'El nombre completo es requerido' })
  nombre_completo: string;

  @ApiProperty({ example: 'usuario@empresa.com' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @ApiProperty({ example: '099123456' })
  @IsOptional()
  telefono?: string;

  @ApiProperty({ example: 'Password123' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: 'El ID de empresa debe ser un número' })
  @IsOptional()
  id_empresa?: number;
}