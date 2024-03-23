import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Csrf } from 'src/decorators/csrf.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express';
import { AddCartDto } from './dto/add-cart.dto';
import { ShoppingCartsService } from './shopping-carts.service';

@Controller('shopping-carts')
@ApiTags('shopping-carts')
@UseGuards(JwtGuard)
@Csrf()
export class ShoppingCartsController {
  constructor(private readonly shoppingCartsService: ShoppingCartsService) {}

  @ApiOperation({
    summary: 'Add Cart',
  })
  @Post()
  addCart(@Body() addCartDto: AddCartDto, @Req() req: Request) {
    return this.shoppingCartsService.addCart(req.user?.id, addCartDto);
  }

  @ApiOperation({
    summary: 'Get Shopping Cart',
  })
  @Get()
  getShoppingCart(@Req() req: Request) {
    return this.shoppingCartsService.getShoppingCart(req.user?.shoppingSession?.id);
  }
}
