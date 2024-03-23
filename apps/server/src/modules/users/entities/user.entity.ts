import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/entities/base.entity';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { OrderDetail } from 'src/modules/orders/entities/order-detail.entity';
import { ShoppingCart } from 'src/modules/shopping-carts/entities/shopping-cart.entity';
import { Entity, Column, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 30,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  email: string;

  @Exclude()
  @Column({
    type: 'varchar',
  })
  password: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens?: RefreshToken[];

  @OneToOne(() => ShoppingCart, (shoppingCart) => shoppingCart.user)
  shoppingCart?: ShoppingCart;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.user)
  orderDetail?: OrderDetail[];

  // @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
  // /**
  //  * m - male
  //  * f - female
  //  * u - unspecified
  //  */
  // gender: string;
}
