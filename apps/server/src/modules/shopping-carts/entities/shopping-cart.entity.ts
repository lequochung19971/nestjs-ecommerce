import { BaseEntity } from 'src/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class ShoppingCart extends BaseEntity {
  @OneToOne(() => User, (user) => user.shoppingCart)
  @JoinColumn()
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.shoppingCart)
  cartItems: CartItem[];
}
