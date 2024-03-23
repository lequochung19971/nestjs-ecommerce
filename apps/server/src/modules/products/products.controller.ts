import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Csrf } from 'src/decorators/csrf.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { ProductsQueryParamsDto } from './dto/products-query-params.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
@ApiTags('products')
@UseGuards(JwtGuard)
@Csrf()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Create product',
  })
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @ApiOperation({
    summary: 'Query products',
  })
  @Get()
  getProducts(@Query() queryParams: ProductsQueryParamsDto) {
    return this.productsService.getProducts(queryParams);
  }

  @ApiOperation({
    summary: 'Get Product by Id',
  })
  @Get(':id')
  getProduct(@Param('id') id: string) {
    return this.productsService.getProduct(id);
  }

  @ApiOperation({
    summary: 'Partial Update product',
  })
  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @ApiOperation({
    summary: 'Delete Product by Id',
  })
  @HttpCode(204)
  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}
