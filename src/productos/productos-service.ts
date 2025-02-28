import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FilterProductoDto } from './dto/filter-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    // Verificar si ya existe un producto con el mismo código de barras
    if (createProductoDto.codigoBarras) {
      const existingProduct = await this.productosRepository.findOne({
        where: { codigoBarras: createProductoDto.codigoBarras }
      });
      
      if (existingProduct) {
        throw new BadRequestException(`Ya existe un producto con el código de barras ${createProductoDto.codigoBarras}`);
      }
    }
    
    const producto = this.productosRepository.create(createProductoDto);
    return this.productosRepository.save(producto);
  }

  async findAll(filterProductoDto: FilterProductoDto): Promise<{ data: Producto[], total: number }> {
    const { search, idCategoria, idProveedor, idEmpresa, page = 1, limit = 10 } = filterProductoDto;
    const skip = (page - 1) * limit;
    
    // Construir condiciones de búsqueda
    const where: FindOptionsWhere<Producto> = {};
    
    if (search) {
      where.nombre = Like(`%${search}%`);
    }
    
    if (idCategoria) {
      where.idCategoria = idCategoria;
    }
    
    if (idProveedor) {
      where.idProveedor = idProveedor;
    }
    
    if (idEmpresa) {
      where.idEmpresa = idEmpresa