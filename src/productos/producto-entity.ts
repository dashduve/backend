import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { Proveedor } from '../../proveedores/entities/proveedor.entity';
import { MovimientoInventario } from '../../movimientos/entities/movimiento-inventario.entity';
import { AlertaStock } from '../../alertas/entities/alerta-stock.entity';

@Entity('producto')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'id_producto' })
  id: number;

  @Column({ name: 'codigo_barras', length: 50, nullable: true, unique: true })
  codigoBarras: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'id_categoria', nullable: true })
  idCategoria: number;

  @Column({ name: 'precio_compra', type: 'decimal', precision: 10, scale: 2 })
  precioCompra: number;

  @Column({ name: 'precio_venta', type: 'decimal', precision: 10, scale: 2 })
  precioVenta: number;

  @Column({ name: 'stock_minimo', default: 0 })
  stockMinimo: number;

  @Column({ name: 'stock_maximo', default: 1000 })
  stockMaximo: number;

  @Column({ name: 'id_empresa' })
  idEmpresa: number;

  @Column({ name: 'id_proveedor', nullable: true })
  idProveedor: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'ultima_actualizacion' })
  ultimaActualizacion: Date;

  @ManyToOne(() => Categoria)
  @JoinColumn({ name: 'id_categoria' })
  categoria: Categoria;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Proveedor;

  @OneToMany(() => MovimientoInventario, movimiento => movimiento.producto)
  movimientos: MovimientoInventario[];

  @OneToMany(() => AlertaStock, alerta => alerta.producto)
  alertas: AlertaStock[];
}
