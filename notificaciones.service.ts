import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alerta } from '../../alertas/entities/alerta.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import * as webpush from 'web-push';

// Interfaces para suscripciones push
interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger('NotificacionesService');
  
  constructor(
    @InjectRepository(Alerta)
    private alertasRepository: Repository<Alerta>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {
    // Configuración de webpush (se tomaría de variables de entorno en producción)
    webpush.setVapidDetails(
      'mailto:ejemplo@tudominio.com',
      process.env.VAPID_PUBLIC_KEY || 'BNbKwYL82EjBfRd1-fumS_3vEZ9YYVI_AjgwF-fzyJmkXoO2GwAOumZTsRm2Q-2XsZhpIxcX9tiN1Y-xDkG1mrg',
      process.env.VAPID_PRIVATE_KEY || 'W_UZYlrMfYkHm0QcgFn5EhZlxUPkBBKVU3BkB_nbeDo'
    );
  }

  // Guardar suscripción push para un usuario
  async guardarSuscripcion(idUsuario: number, subscription: PushSubscription) {
    const usuario = await this.usuariosRepository.findOne({
      where: { id_usuario: idUsuario }
    });
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    // En un caso real, guardaríamos la suscripción en la base de datos
    // Simplificado para el ejemplo
    this.logger.log(`Suscripción guardada para usuario ${idUsuario}`);
    return { success: true };
  }
  
  // Enviar notificación push cuando hay alerta de stock
  async enviarNotificacionAlerta(alerta: Alerta) {
    try {
      // Obtener el producto relacionado con la alerta
      const producto = await this.productosRepository.findOne({
        where: { id_producto: alerta.id_producto }
      });
      
      if (!producto) {
        throw new Error('Producto no encontrado');
      }
      
      // En un caso real, obtendríamos las suscripciones de los usuarios con rol adecuado
      // y enviaríamos la notificación a cada uno
      
      const notificacion = {
        title: 'Alerta de Stock Bajo',
        body: `El producto ${producto.nombre} ha alcanzado el nivel mínimo de stock.`,
        icon: '/assets/icons/icon-72x72.png',
        badge: '/assets/icons/badge-72x72.png',
        data: {
          url: `/inventario/producto/${producto.id_producto}`,
          idAlerta: alerta.id_alerta,
          fechaCreacion: alerta.fecha_creacion
        }
      };
      
      this.logger.log(`Notificación de alerta enviada para producto ${producto.nombre}`);
      
      // Ejemplo de envío (en un caso real, iteraríamos sobre las suscripciones)
      // const subscription = { ... datos de suscripción ... };
      // await webpush.sendNotification(subscription, JSON.stringify(notificacion));
      
      return { success: true, message: 'Notificación enviada' };
    } catch (error) {
      this.logger.error('Error al enviar notificación push', error);
      return { success: false, error: error.message };
    }
  }
  
  // Obtener las claves VAPID públicas (para frontend)
  getVapidPublicKey() {
    return { publicKey: process.env.VAPID_PUBLIC_KEY || 'BNbKwYL82EjBfRd1-fumS_3vEZ9YYVI_AjgwF-fzyJmkXoO2GwAOumZTsRm2Q-2XsZhpIxcX9tiN1Y-xDkG1mrg' };
  }
}