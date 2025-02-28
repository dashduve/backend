import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './dto/create-reporte.dto';
import { UpdateReporteDto } from './dto/update-reporte.dto';
import { FilterReporteDto } from './dto/filter-reporte.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('reportes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  @Roles('Administrador', 'Reportes')
  @ApiOperation({ summary: 'Crear un nuevo reporte' })
  @ApiResponse({ status: 201, description: 'Reporte creado exitosamente' })
  create(@Body() createReporteDto: CreateReporteDto) {
    return this.reportesService.create(createReporteDto);
  }

  @Get()
  @Roles('Administrador', 'Reportes')
  @ApiOperation({ summary: 'Obtener todos los reportes con filtros opcionales' })
  findAll(@Query() filterDto: FilterReporteDto) {
    return this.reportesService.findAll(filterDto);
  }

  @Get(':id')
  @Roles('Administrador', 'Reportes')
  @ApiOperation({ summary: 'Obtener un reporte por ID' })
  @ApiResponse({ status: 200, description: 'Reporte encontrado' })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  findOne(@Param('id') id: string) {
    return this.reportesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Administrador', 'Reportes')
  @ApiOperation({ summary: 'Actualizar un reporte por ID' })
  @ApiResponse({ status: 200, description: 'Reporte actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  update(@Param('id') id: string, @Body() updateReporteDto: UpdateReporteDto) {
    return this.reportesService.update(+id, updateReporteDto);
  }

  @Delete(':id')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar un reporte por ID' })
  @ApiResponse({ status: 200, description: 'Reporte eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  remove(@Param('id') id: string) {
    return this.reportesService.remove(+id);
  }

  @Get('descargar/:id')
  @Roles('Administrador', 'Reportes')
  @ApiOperation({ summary: 'Descargar un reporte en formato PDF' })
  @ApiResponse({ status: 200, description: 'Descarga iniciada' })
  @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
  async descargarReporte(@Param('id') id: string, @Res() res: Response) {
    const reporte = await this.reportesService.findOne(+id);
    
    if (!reporte.archivo_pdf || !fs.existsSync(reporte.archivo_pdf)) {
      throw new Error('El archivo del reporte no existe');
    }
    
    const fileName = reporte.archivo_pdf.split('/').pop();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
    const fileStream = fs.createReadStream(reporte.archivo_pdf);
    fileStream.pipe(res);
  }
}
