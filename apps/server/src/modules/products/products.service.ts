import { Injectable } from '@nestjs/common';
import { toQueryResponseDto } from 'src/utils/toDtoArray';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product-dto';
import { ProductsQueryParamsDto } from './dto/products-query-params.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductNotFound } from './exceptions/product-not-found';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(createProductDto: CreateProductDto) {
    const productEntity = this.productRepository.create({
      title: createProductDto.title,
      media: createProductDto.mediaIds?.map((id) => ({ id })),
      categories: createProductDto.categoryIds?.map((id) => ({ id })),
      description: createProductDto.description,
    });

    const { id } = await this.productRepository.save(productEntity);
    return (
      await this.productRepository.findOne({
        relations: {
          categories: true,
          media: true,
        },
        where: {
          id,
        },
      })
    ).toDto(ProductDto);
  }

  async getProducts(params: ProductsQueryParamsDto) {
    let queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.media', 'file')
      .leftJoinAndSelect('product.categories', 'category');

    if (params.search?.columns?.length && params.search?.value) {
      queryBuilder = queryBuilder.search(
        params.search.columns,
        params.search.value,
      );
    }

    let totalCount: number;
    if (params.includeTotalCount) {
      totalCount = await queryBuilder.getCount();
    }

    const products = await queryBuilder
      .orderBy(params.orderColumn, params.order)
      .take(params.take)
      .skip(params.skip)
      .getMany();

    return toQueryResponseDto(ProductDto, {
      entity: products,
      meta: {
        page: params.page,
        take: params.take,
        totalCount,
      },
    });
  }

  async getProduct(id: string) {
    const productEntity = await this.productRepository.findOne({
      relations: {
        categories: true,
        media: true,
      },
      where: {
        id,
      },
    });

    if (!productEntity) {
      throw new ProductNotFound();
    }

    return productEntity.toDto(ProductDto);
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const productEntity = await this.productRepository.findOneBy({
      id,
    });

    if (!productEntity) {
      throw new ProductNotFound();
    }

    this.productRepository.merge(productEntity, {
      id,
      title: updateProductDto.title,
      description: updateProductDto.description,
      categories: updateProductDto.categoryIds?.map((id) => ({ id })),
      media: updateProductDto.mediaIds?.map((id) => ({ id })),
    });

    await this.productRepository.save(productEntity);
    return (await this.productRepository.findOneBy({ id })).toDto(ProductDto);
  }

  async deleteProduct(id: string) {
    const productEntity = await this.productRepository.findOneBy({
      id,
    });

    if (!productEntity) {
      throw new ProductNotFound();
    }

    this.productRepository.softDelete(id);
  }
}
