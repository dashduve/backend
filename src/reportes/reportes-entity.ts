import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Empresa } from '../../empresas/entities/empresa.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('reporte')
export class Reporte {
  @PrimaryGeneratedColumn()
  id_reporte: number;

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @Column({
    type: 'enum',
    enum: ['Inventario', 'Ventas', 'Perdidas'],
    nullable: false,
  })
  tipo: string;

  @CreateDateColumn({ name: 'fecha_generacion' })
  fecha_generacion: Date;

  @Column({ name: 'archivo_pdf', nullable: true })
  archivo_pdf: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;
}
