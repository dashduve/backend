import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn, CreateDateColumn } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { DetallePedido } from './detalle-pedido.entity';

export enum EstadoPedido {
  PENDIENTE = 'Pendiente',
  ENTREGADO = 'Entregado',
  CANCELADO = 'Cancelado',
}

@Entity('pedido')
export class Pedido {
  @PrimaryGeneratedColumn()
  id_pedido: number;

  @Column()
  id_empresa: number;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @CreateDateColumn()
  fecha_solicitud: Date;

  @Column({ type: 'date', nullable: true })
  fecha_entrega: Date;

  @Column({
    type: 'enum',
    enum: EstadoPedido,
    default: EstadoPedido.PENDIENTE,
  })
  estado: EstadoPedido;

  @OneToMany(() => DetallePedido, detalle => detalle.pedido)
  detalles: DetallePedido[];
}