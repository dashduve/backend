import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usuariosService.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // No devolver datos sensibles
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    // Actualizar última conexión
    await this.usuariosService.updateLastLogin(user.id);
    
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar si el email ya está registrado
    const existingUser = await this.usuariosService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }
    
    // Crear nuevo usuario
    const user = await this.usuariosService.create({
      nombreCompleto: registerDto.nombreCompleto,
      email: registerDto.email,
      passwordHash: await bcrypt.hash(registerDto.password, 10),
      telefono: registerDto.telefono,
      idEmpresa: registerDto.idEmpresa,
    });
    
    // Generar token
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async refreshToken(userId: number) {
    const user = await this.usuariosService.findOne(userId);
    
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }
    
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
