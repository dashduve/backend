import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { FilterInventarioDto } from './dto/filter-inventario.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('inventario')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('inventario')
export class InventarioController {
  constructor(private readonly inventarioService: InventarioService) {}

  @Post()
  @Roles('Administrador', 'Inventario')
  @ApiOperation({ summary: 'Crear un nuevo registro de inventario' })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente' })
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioService.create(createInventarioDto);
  }

  @Get()
  @Roles('Administrador', 'Inventario', 'Reportes')
  @ApiOperation({ summary: 'Obtener todos los registros de inventario con filtros opcionales' })
  findAll(@Query() filterDto: FilterInventarioDto) {
    return this.inventarioService.findAll(filterDto);
  }

  @Get(':id')
  @Roles('Administrador', 'Inventario', 'Reportes')
  @ApiOperation({ summary: 'Obtener un registro de inventario por ID' })
  @ApiResponse({ status: 200, description: 'Registro encontrado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  findOne(@Param('id') id: string) {
    return this.inventarioService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Administrador', 'Inventario')
  @ApiOperation({ summary: 'Actualizar un registro de inventario por ID' })
  @ApiResponse({ status: 200, description: 'Registro actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  update(@Param('id') id: string, @Body() updateInventarioDto: UpdateInventarioDto) {
    return this.inventarioService.update(+id, updateInventarioDto);
  }

  @Delete(':id')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar un registro de inventario por ID' })
  @ApiResponse({ status: 200, description: 'Registro eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  remove(@Param('id') id: string) {
    return this.inventarioService.remove(+id);
  }

  @Get('producto/:id')
  @Roles('Administrador', 'Inventario', 'Reportes', 'Ventas')
  @ApiOperation({ summary: 'Obtener el stock actual de un producto' })
  @ApiResponse({ status: 200, description: 'Stock obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  getStockByProducto(@Param('id') id: string) {
    return this.inventarioService.getStockByProducto(+id);
  }

  @Post('actualizar-stock/:id')
  @Roles('Administrador', 'Inventario')
  @ApiOperation({ summary: 'Actualizar el stock de un producto' })
  @ApiResponse({ status: 200, description: 'Stock actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  actualizarStock(
    @Param('id') id: string,
    @Body('cantidad') cantidad: number,
    @Body('tipo') tipo: string,
    @Body('motivo') motivo: string,
    @Body('usuarioId') usuarioId: number,
  ) {
    return this.inventarioService.actualizarStock(+id, cantidad, tipo, motivo, usuarioId);
  }
}
