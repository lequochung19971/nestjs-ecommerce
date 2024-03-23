import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity()
export class OrderDetail extends BaseEntity {
  @ManyToOne(() => User, (user) => user.orderDetail)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.orderDetail)
  orderItems: OrderItem[];
}
