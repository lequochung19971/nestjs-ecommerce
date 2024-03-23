import { Module } from '@nestjs/common';
import { ShoppingCartsService } from './shopping-carts.service';
import { ShoppingCartRepository } from './shopping-cart.repository';
import { ShoppingCartsController } from './shopping-carts.controller';
import { CartItemRepository } from './cart-item.repository';
import { UserRepository } from '../users/user.repository';

@Module({
  controllers: [ShoppingCartsController],
  providers: [
    ShoppingCartsService,
    ShoppingCartRepository,
    CartItemRepository,
    UserRepository,
  ],
})
export class ShoppingCartsModule {}
