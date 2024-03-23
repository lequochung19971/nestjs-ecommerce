import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ShoppingCart } from './entities/shopping-cart.entity';

@Injectable()
export class ShoppingCartRepository extends Repository<ShoppingCart> {
  constructor(private dataSource: DataSource) {
    super(ShoppingCart, dataSource.createEntityManager());
  }
}
