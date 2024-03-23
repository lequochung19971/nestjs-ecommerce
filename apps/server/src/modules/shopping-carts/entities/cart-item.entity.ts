import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { ShoppingCart } from './shopping-cart.entity';

@Entity()
export class CartItem extends BaseEntity {
  @ManyToOne(() => ShoppingCart)
  shoppingCart: ShoppingCart;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column({
    type: 'int',
  })
  quantity: number;
}
