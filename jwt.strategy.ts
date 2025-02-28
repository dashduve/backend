import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usuariosService: UsuariosService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('app.jwtSecret'),
    });
  }

  async validate(payload: any) {
    // Buscar el usuario en la base de datos para obtener información actualizada
    const usuario = await this.usuariosService.findOne(payload.sub);
    
    if (!usuario || usuario.estado !== 'Activo') {
      throw new UnauthorizedException('Usuario inactivo o no encontrado');
    }
    
    // Actualizar la última conexión
    await this.usuariosService.updateLastConnection(usuario.id_usuario);
    
    return {
      id: usuario.id_usuario,
      email: usuario.email,
      nombre: usuario.nombre_completo,
      roles: usuario.roles,
      empresa: usuario.empresa,
    };
  }
}