import { Controller, Req, Get, HttpException, HttpStatus, Put, UsePipes, Body, Delete, Param } from '@nestjs/common';
import { CartService } from '../../services/cart/cart.service';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { AddProductToCartRequest } from '../../request-dtos/cart-requests';

@Controller('cart')
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { }

    @Get('favourites/:userId')
    async getFavourites(@Req() req, @Param() params) {
        if (params.userId !== req.currentUser.id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        try {
            return await this.cartService.getFavourites(params.userId);
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:userId')
    async getCartItems(@Req() req, @Param() params) {
        if (params.userId !== req.currentUser.id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        try {
            return await this.cartService.getCartItems(params.userId);
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put('/:userId')
    @UsePipes(ValidationPipe)
    async putProductsInCart(@Req() req, @Param() params, @Body() addToCartReq: AddProductToCartRequest) {
        if (params.userId !== req.currentUser.id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        
        try {
            return await this.cartService.putProductsInCart(params.userId, addToCartReq.cartItems);
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':userId/:itemId')
    async removeProductFromCart(@Req() req, @Param() params) {
        if (params.userId !== req.currentUser.id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        try {
            await this.cartService.removeProductFromCart(params.userId, params.itemId);
            return 'Product removed from cart';
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

/*     @Put()
    async putFavourites(@Req() req, @Body() favourites, @Param() params) {
        if (params.userId !== req.currentUser.id) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }

        try {
            await this.cartService.putFavourites(params.userId, favourites);
            return 'Favourites added successfully';
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } */
}
