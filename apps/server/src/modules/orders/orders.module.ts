import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderDetailRepository } from './order-detail.repository';
import { OrderItemRepository } from './order-item.repository';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrderDetailRepository, OrderItemRepository],
})
export class OrdersModule {}
