import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { toQueryResponseDto } from 'src/utils/toDtoArray';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { User } from '../users/entities/user.entity';
import { UserNotFound } from '../users/exceptions/user-not-found';
import { OrdersQueryParamsDto } from './dto/orders-query-params.dto';
import { OrderDetailRepository } from './order-detail.repository';
import { OrderDto } from './dto/order-dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderDetailNotFound } from './exceptions/order-detail-not-found';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly orderDetailRepository: OrderDetailRepository,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const currentUser = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        relations: {
          shoppingCart: true,
        },
      });

      if (!currentUser) {
        throw new UserNotFound();
      }

      const orderItemEntities = createOrderDto.orderItems.map((orderItem) =>
        queryRunner.manager.create(OrderItem, {
          product: {
            id: orderItem.productId,
          },
          quantity: orderItem.quantity,
        }),
      );
      const orderDetailEntity = queryRunner.manager.create(OrderDetail, {
        user: currentUser,
      });
      const savedOrderItemEntities = await queryRunner.manager.save(
        OrderItem,
        orderItemEntities,
      );

      orderDetailEntity.orderItems = savedOrderItemEntities;
      await queryRunner.manager.save(OrderDetail, orderDetailEntity);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getOrders(params: OrdersQueryParamsDto) {
    let queryBuilder = this.orderDetailRepository
      .createQueryBuilder('orderDetail')
      .leftJoinAndSelect('orderDetail.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.product', 'product')
      .leftJoinAndSelect('product.media', 'file');

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

    const orderDetails = await queryBuilder
      .orderBy(params.orderColumn, params.order)
      .take(params.take)
      .skip(params.skip)
      .getMany();

    return toQueryResponseDto(OrderDto, {
      entity: orderDetails,
      meta: {
        page: params.page,
        take: params.take,
        totalCount,
      },
    });
  }

  async updateOrder(orderDetailId: string, updateOrderDto: UpdateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.startTransaction();
    try {
      const currentOrderDetail = await queryRunner.manager.findOne(
        OrderDetail,
        {
          where: { id: orderDetailId },
          relations: {
            orderItems: true,
          },
        },
      );

      if (!currentOrderDetail) {
        throw new OrderDetailNotFound();
      }

      const newOrderItemEntities = updateOrderDto.orderItems.map((oi) =>
        queryRunner.manager.create(OrderItem, {
          product: {
            id: oi.productId,
          },
          quantity: oi.quantity,
        }),
      );

      /**
       * Filter New Order Items and Updated Order Items
       */
      const filteredResult = (newOrderItemEntities ?? [])?.reduce(
        (result, orderItemEntity) => {
          const exitedItemEntity = currentOrderDetail.orderItems?.find(
            (i) => i.id === orderItemEntity.id,
          );

          if (exitedItemEntity) {
            result.updatedItems.push(
              queryRunner.manager.merge(
                OrderItem,
                orderItemEntity,
                exitedItemEntity,
              ),
            );
          } else {
            result.newItems.push(orderItemEntity);
          }

          return result;
        },
        { newItems: [], updatedItems: [] } as {
          newItems: OrderItem[];
          updatedItems: OrderItem[];
        },
      );
      const { newItems, updatedItems } = filteredResult;

      /**
       * Filter Deleted Items
       */
      const deletedItems = currentOrderDetail.orderItems.filter(
        (currentOrderItem) =>
          !newOrderItemEntities.find(
            (noi) => noi.product.id === currentOrderItem.product.id,
          ) || currentOrderItem.quantity <= 0,
      );

      /**
       * Save New Order Items
       */
      const savedNewOrderItems = await queryRunner.manager.save(
        OrderItem,
        newItems,
      );

      /**
       * Soft Delete Order Items
       */
      queryRunner.manager.softDelete(OrderItem, deletedItems);

      currentOrderDetail.orderItems = [
        ...savedNewOrderItems,
        ...updatedItems,
      ].filter((i) => i.quantity > 0);
      await queryRunner.manager.save(OrderDetail, currentOrderDetail);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteOrder(orderDetailId: string) {
    if (
      !(await this.orderDetailRepository.findOneBy({
        id: orderDetailId,
      }))
    ) {
      throw new OrderDetailNotFound();
    }

    this.orderDetailRepository.softDelete(orderDetailId);
  }
}
