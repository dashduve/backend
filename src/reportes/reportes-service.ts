import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Reporte } from './entities/reporte.entity';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { FilterReporteDto } from './dto/filter-reporte.dto';
import { InventarioService } from '../inventario/inventario.service';
import { MovimientosService } from '../movimientos/movimientos.service';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(Reporte)
    private reporteRepository: Repository<Reporte>,
    private inventarioService: InventarioService,
    private movimientosService: MovimientosService,
  ) {}

  async create(createReporteDto: CreateReporteDto): Promise<Reporte> {
    // Crear el reporte en la base de datos primero
    const reporte = this.reporteRepository.create({
      empresa: { id_empresa: createReporteDto.id_empresa },
      tipo: createReporteDto.tipo,
      usuario: { id_usuario: createReporteDto.id_usuario },
    });
    
    const savedReporte = await this.reporteRepository.save(reporte);
    
    // Generar el archivo PDF según el tipo de reporte
    const pdfFilePath = await this.generarReportePDF(savedReporte);
    
    // Actualizar la ruta del archivo en la base de datos
    savedReporte.archivo_pdf = pdfFilePath;
    return await this.reporteRepository.save(savedReporte);
  }

  async findAll(filterDto: FilterReporteDto): Promise<Reporte[]> {
    const { idEmpresa, tipo, fechaInicio, fechaFin, idUsuario } = filterDto;
    
    let where: FindOptionsWhere<Reporte> = {};
    
    if (idEmpresa) {
      where.empresa = { id_empresa: idEmpresa };
    }
    
    if (tipo) {
      where.tipo = tipo;
    }
    
    if (idUsuario) {
      where.usuario = { id_usuario: idUsuario };
    }
    
    if (fechaInicio && fechaFin) {
      where.fecha_generacion = Between(new Date(fechaInicio), new Date(fechaFin));
    }
    
    return await this.reporteRepository.find({
      where,
      relations: ['empresa', 'usuario'],
      order: { fecha_generacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Reporte> {
    const reporte = await this.reporteRepository.findOne({
      where: { id_reporte: id },
      relations: ['empresa', 'usuario'],
    });
    
    if (!reporte) {
      throw new NotFoundException(`Reporte con ID ${id} no encontrado`);
    }
    
    return reporte;
  }

  async update(id: number, updateReporteDto: UpdateReporteDto): Promise<Reporte> {
    const reporte = await this.findOne(id);
    
    if (updateReporteDto.id_empresa) {
      reporte.empresa = { id_empresa: updateReporteDto.id_empresa } as any;
    }
    
    if (updateReporteDto.tipo) {
      reporte.tipo = updateReporteDto.tipo;
    }
    
    if (updateReporteDto.archivo_pdf) {
      reporte.archivo_pdf = updateReporteDto.archivo_pdf;
    }
    
    if (updateReporteDto.id_usuario) {
      reporte.usuario = { id_usuario: updateReporteDto.id_usuario } as any;
    }
    
    return await this.reporteRepository.save(reporte);
  }

  async remove(id: number): Promise<void> {
    const reporte = await this.findOne(id);
    
    // Eliminar el archivo físico si existe
    if (reporte.archivo_pdf && fs.existsSync(reporte.archivo_pdf)) {
      fs.unlinkSync(reporte.archivo_pdf);
    }
    
    await this.reporteRepository.remove(reporte);
  }

  private async generarReportePDF(reporte: Reporte): Promise<string> {
    // Crear directorio para reportes si no existe
    const reportesDir = path.join(process.cwd(), 'reportes');
    if (!fs.existsSync(reportesDir)) {
      fs.mkdirSync(reportesDir, { recursive: true });
    }
    
    // Generar nombre de archivo único
    const fileName = `reporte_${reporte.tipo.toLowerCase()}_${reporte.id_reporte}_${Date.now()}.pdf`;
    const filePath = path.join(reportesDir, fileName);
    
    // Crear documento PDF
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    
    // Contenido del PDF según el tipo de reporte
    doc.fontSize(25).text(`Reporte de ${reporte.tipo}`, {
      align: 'center',
    });
    
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${reporte.fecha_generacion.toLocaleString()}`, {
      align: 'right',
    });
    
    doc.moveDown();
    doc.text(`Empresa ID: ${reporte.empresa.id_empresa}`);
    doc.text(`Generado por: Usuario ID ${reporte.usuario.id_usuario}`);
    
    doc.moveDown();
    
    // Generar contenido específico según el tipo de reporte
    switch (reporte.tipo) {
      case 'Inventario':
        await this.generarContenidoReporteInventario(doc);
        break;
      case 'Ventas':
        await this.generarContenidoReporteVentas(doc);
        break;
      case 'Perdidas':
        await this.generarContenidoReportePerdidas(doc);
        break;
    }
    
    // Finalizar el documento
    doc.end();
    
    // Esperar a que el archivo se escriba completamente
    return new Promise((resolve) => {
      stream.on('finish', () => {
        resolve(filePath);
      });
    });
  }

  private async generarContenidoReporteInventario(doc: PDFDocument): Promise<void> {
    doc.fontSize(16).text('Estado Actual del Inventario', {
      underline: true,
    });
    
    doc.moveDown();
    
    // Aquí implementarías la lógica para obtener y mostrar los datos del inventario
    // Por ejemplo, consultar los productos con su stock y generar una tabla
    
    doc.fontSize(12).text('Este reporte muestra el estado actual del inventario, incluyendo:');
    doc.moveDown();
    doc.text('- Productos con stock bajo el mínimo');
    doc.text('- Productos con stock sobre el máximo');
    doc.text('- Valoración total del inventario');
    doc.text('- Movimientos recientes');
    
    // Implementación real requeriría consultar el servicio de inventario
    // y formatear los datos en el PDF
  }

  private async generarContenidoReporteVentas(doc: PDFDocument): Promise<void> {
    doc.fontSize(16).text('Reporte de Ventas', {
      underline: true,
    });
    
    doc.moveDown();
    
    // Implementar lógica para mostrar ventas
    doc.fontSize(12).text('Este reporte muestra las ventas realizadas, incluyendo:');
    doc.moveDown();
    doc.text('- Productos más vendidos');
    doc.text('- Total de ventas por período');
    doc.text('- Comparativa con períodos anteriores');
  }

  private async generarContenidoReportePerdidas(doc: PDFDocument): Promise<void> {
    doc.fontSize(16).text('Reporte de Pérdidas y Ajustes', {
      underline: true,
    });
    
    doc.moveDown();
    
    // Implementar lógica para mostrar pérdidas y ajustes
    doc.fontSize(12).text('Este reporte muestra las pérdidas y ajustes de inventario, incluyendo:');
    doc.moveDown();
    doc.text('- Productos con ajustes negativos');
    doc.text('- Motivos de los ajustes');
    doc.text('- Valoración de pérdidas');
  }
}
