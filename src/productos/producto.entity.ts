import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { MovimientoInventario } from '../../movimientos/entities/movimiento.entity';
import { AlertaStock } from '../../alertas/entities/alerta.entity';
import { DetallePedido } from '../../pedidos/entities/detalle-pedido.entity';

@Entity('producto')
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column({ unique: true, nullable: true })
  codigo_barras: string;

  @Column()
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column()
  precio_compra: number;

  @Column()
  precio_venta: number;

  @Column({ default: 0 })
  stock_minimo: number;

  @Column({ default: 1000 })
  stock_maximo: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'ultima_actualizacion' })
  ultimaActualizacion: Date;

  // Relaciones
  @Column({ nullable: true })
  id_categoria: number;
  
  @ManyToOne(() => Categoria, categoria => categoria.productos)
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

  @Column({ nullable: true })
  id_empresa: number;
  
  @ManyToOne(() => Empresa, empresa => empresa.productos)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @Column({ nullable: true })
  id_proveedor: number;
  
  @ManyToOne(() => Proveedor, proveedor => proveedor.productos)
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Proveedor;

  @OneToMany(() => MovimientoInventario, movimiento => movimiento.producto)
  movimientos: MovimientoInventario[];

  @OneToMany(() => AlertaStock, alerta => alerta.producto)
  alertas: AlertaStock[];

  @OneToMany(() => DetallePedido, detallePedido => detallePedido.producto)
  detallesPedido: DetallePedido[];
  
  // Propiedades virtuales (no mapeadas a la BD)
  stock?: number;
}