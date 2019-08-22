import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL_TOKEN, PRODUCT_MODEL_TOKEN } from '../../models/model-tokens';
import { Model } from 'mongoose';
import { User } from '../../interfaces/user.interface';
import { Product } from '../../interfaces/product.interface';
import { CartItem } from '../../request-dtos/cart-requests';

@Injectable()
export class CartService {
    private readonly productFields = 'title vendor imageUrls price salePrice onSale stock';

    constructor(
        @InjectModel(USER_MODEL_TOKEN) private readonly userModel: Model<User>,
        @InjectModel(PRODUCT_MODEL_TOKEN) private readonly productModel: Model<Product>
    ) { }

    async getFavourites(userId: string) {
        try {
            return await this.userModel.findById(userId, { favourites: 1 })
                .populate('favourites', this.productFields)
                .exec();
        } catch (err) {
            console.log('Get favourites error', err);
            throw err instanceof Error ? 'Unexpected error occurred while getting favourites' : err;
        }
    }

    async getCartItems(userId: string) {
        try {
            const user = await this.userModel.findById(userId, { cart: 1 })
                .populate('cart.product', this.productFields)
                .exec();

            if (!user) {
                throw 'User not found';
            }
            return user.cart;
        } catch (err) {
            console.log('Get cart items error', err);
            throw err instanceof Error ? 'Unexpected error occurred while getting cart items' : err;
        }
    }

    async removeProductFromCart(userId: string, itemId: string) {
        try {
            await this.userModel.findByIdAndUpdate(
                userId,
                {
                    $pull: {
                        'cart': { '_id': itemId }
                    }
                }
            );
        } catch (err) {
            console.log('Remove cart item error', err);
            throw 'Unexpected error occurred while removing product from cart';
        }
    }

    async putProductsInCart(userId: string, cartItems: CartItem[]) {
        try {
            const productIds = cartItems.map(i => i.product);
            const findUser = this.userModel.findById(userId);
            const findProducts: any = this.productModel.find({ _id: { $in: productIds } }, { _id: 1 });
            const [user, products] = await Promise.all([findUser, findProducts]);
            await this.addOrUpdateProductsInCart(user, products, cartItems);
            return await this.getCartItems(userId);
        } catch (err) {
            console.log('Put cart item error', err);
            throw err instanceof Error ? 'Unexpected error occurred while saving product to cart' : err;
        }
    }

    private async addOrUpdateProductsInCart(user, products, cartItems: CartItem[]) {
        if (!products || products.length == 0) {
            throw 'Products not found';
        }
        cartItems.filter(item => {
            return products.some(p => p._id.equals(item.product));
        }).forEach((item) => {
            const index = user.cart.findIndex(cartItem => cartItem.product == item.product);
            if (index !== -1) {
                user.cart[index].quantity += item.quantity;
            } else {
                user.cart.push(item);
            }
        });
        return await user.save();
    }
}
