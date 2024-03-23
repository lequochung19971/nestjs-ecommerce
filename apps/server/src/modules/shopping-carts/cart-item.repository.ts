import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartItemRepository extends Repository<CartItem> {
  constructor(private dataSource: DataSource) {
    super(CartItem, dataSource.createEntityManager());
  }
}
