import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { ShoppingCartRepository } from './shopping-cart.repository';
import { CartItemRepository } from './cart-item.repository';
import { AddCartDto } from './dto/add-cart.dto';
import { CartItem } from './entities/cart-item.entity';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { ShoppingCartNotFound } from './exceptions/shopping-cart-not-found';
import { ShoppingCartDto } from './dto/shopping-cart.dto';
import { UserRepository } from '../users/user.repository';
import { UserNotFound } from '../users/exceptions/user-not-found';

@Injectable()
export class ShoppingCartsService {
  constructor(
    private readonly shoppingCartRepository: ShoppingCartRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async addCart(userId: string, addCartDto: AddCartDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const shoppingCartEntity = await this.createOrGetShoppingCartByUserId(queryRunner, userId);

      // Create Cart Item Entities
      const newCartItemEntities = queryRunner.manager.create(
        CartItem,
        addCartDto.cartItems.map(
          (c) =>
            ({
              id: c.id,
              product: {
                id: c.productId,
              },
              shoppingCart: {
                id: shoppingCartEntity.id,
              },
              quantity: c.quantity,
            }) as CartItem,
        ),
      );

      const existedCartItems = shoppingCartEntity.cartItems ?? [];

      // Merge new information for Added Cart Items
      const filteredResult = newCartItemEntities.reduce(
        (result, item) => {
          const existedItem = newCartItemEntities.find((c) => c.product.id === item.product.id);
          if (existedItem) {
            result.updatedItems.push(queryRunner.manager.merge(CartItem, item, existedItem));
          } else {
            result.newItems.push(item);
          }
          return result;
        },
        { newItems: [], updatedItems: [] } as {
          newItems: CartItem[];
          updatedItems: CartItem[];
        },
      );
      const { newItems, updatedItems } = filteredResult;

      const savedNewCartItems = await queryRunner.manager.save(CartItem, newItems);

      const validCartItems = [...savedNewCartItems, ...updatedItems].filter((c) => c.quantity > 0);

      const deletedCartItem = existedCartItems.filter(
        (item) => !newCartItemEntities.find((i) => i.id === item.id) || item.quantity <= 0,
      );

      /**
       *  Soft Delete Cart Items
       */
      if (deletedCartItem.length) {
        queryRunner.manager.softDelete(CartItem, deletedCartItem);
      }

      queryRunner.manager.merge(ShoppingCart, shoppingCartEntity, {
        cartItems: validCartItems,
      });
      await queryRunner.manager.save(ShoppingCart, shoppingCartEntity);
      await queryRunner.commitTransaction();

      const res = await this.shoppingCartRepository.findOne({
        where: {
          id: shoppingCartEntity.id,
        },
        relations: {
          cartItems: {
            product: {
              media: true,
            },
          },
        },
      });
      return res.toDto(ShoppingCartDto);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getShoppingCart(id: string) {
    const shoppingCart = await this.shoppingCartRepository.findOne({
      where: {
        id,
      },
      relations: {
        cartItems: {
          product: {
            media: true,
          },
        },
      },
    });

    if (!shoppingCart) {
      throw new ShoppingCartNotFound();
    }

    return shoppingCart.toDto(ShoppingCartDto);
  }

  private async createOrGetShoppingCartByUserId(queryRunner: QueryRunner, userId: string) {
    const currentUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: {
        shoppingCart: true,
      },
    });

    if (!currentUser) {
      throw new UserNotFound();
    }

    let shoppingCartEntity: ShoppingCart;
    if (!currentUser.shoppingCart?.id) {
      shoppingCartEntity = await queryRunner.manager.create(ShoppingCart, {
        user: currentUser,
      });
      await queryRunner.manager.save(ShoppingCart, shoppingCartEntity);
    }

    return queryRunner.manager.findOne(ShoppingCart, {
      where: {
        user: {
          id: currentUser.id,
        },
      },
      relations: {
        user: true,
        cartItems: {
          product: true,
        },
      },
    });
  }
}
