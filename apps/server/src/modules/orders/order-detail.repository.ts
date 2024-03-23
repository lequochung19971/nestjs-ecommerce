import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { OrderDetail } from './entities/order-detail.entity';

@Injectable()
export class OrderDetailRepository extends Repository<OrderDetail> {
  constructor(private dataSource: DataSource) {
    super(OrderDetail, dataSource.createEntityManager());
  }
}
