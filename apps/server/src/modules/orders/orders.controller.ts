import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Csrf } from 'src/decorators/csrf.decorator';
import { Request } from 'express';
import { JwtGuard } from 'src/guards/jwt.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersQueryParamsDto } from './dto/orders-query-params.dto';

@Controller('orders')
@ApiTags('orders')
@UseGuards(JwtGuard)
@Csrf()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Create Order',
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    this.ordersService.createOrder(req.user?.id, createOrderDto);
  }

  @ApiOperation({
    summary: 'Query Orders',
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  getOrder(@Query() ordersQueryParams: OrdersQueryParamsDto) {
    return this.ordersService.getOrders(ordersQueryParams);
  }

  @ApiOperation({
    summary: 'Update Order',
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  updateOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    this.ordersService.createOrder(req.user?.id, createOrderDto);
  }
}
