import { BaseEntity } from 'src/entities/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { OrderDetail } from './order-detail.entity';

@Entity()
export class OrderItem extends BaseEntity {
  @ManyToOne(() => OrderDetail)
  orderDetail: OrderDetail;

  @ManyToOne(() => Product)
  @JoinColumn()
  product: Product;

  @Column({
    type: 'int',
  })
  quantity: number;
}
