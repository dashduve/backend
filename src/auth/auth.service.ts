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

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Buscar usuario por email
    const usuario = await this.usuariosService.findByEmail(email);
    
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Verificar estado del usuario
    if (usuario.estado !== 'Activo') {
      throw new UnauthorizedException('El usuario está inactivo');
    }
    
    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, usuario.password_hash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    // Generar token JWT
    const payload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      nombre: usuario.nombre_completo,
    };
    
    // Actualizar última conexión
    await this.usuariosService.updateLastConnection(usuario.id_usuario);
    
    return {
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre_completo,
        email: usuario.email,
        roles: usuario.roles,
        empresa: usuario.empresa,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const { email } = registerDto;
    
    // Verificar si el email ya está registrado
    const existeUsuario = await this.usuariosService.findByEmail(email);
    
    if (existeUsuario) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }
    
    // Crear nuevo usuario
    const usuario = await this.usuariosService.create(registerDto);
    
    // Generar token JWT
    const payload = {
      sub: usuario.id_usuario,
      email: usuario.email,
      nombre: usuario.nombre_completo,
    };
    
    return {
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre_completo,
        email: usuario.email,
        roles: usuario.roles,
        empresa: usuario.empresa,
      },
      token: this.jwtService.sign(payload),
    };
  }
}