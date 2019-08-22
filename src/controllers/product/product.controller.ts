import { Controller, Query, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { ProductService } from '../../services/product/product.service';

@Controller()
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Get('products')
    async getProducts(@Query() query) {
        try {
            const pageNumber = (query.page && parseInt(query.page) > 0) ? parseInt(query.page) : 0;
            const [count, products] = await this.productService.getProducts(pageNumber, query.q);
            const res = {
                currentPage: pageNumber,
                itemsPerPage: this.productService.docsPerPage,
                totalPages: Math.floor(count / this.productService.docsPerPage),
                products: products
            };
            return res;
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('product/newarrivals')
    async getNewArrivals() {
        try {
            return await this.productService.getNewArrivals();
        }
        catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('product/:id')
    async getProductById(@Param() params) {
        try {
            const id = params.id;
            if (!id) {
                throw 'Product id is required';
            }
            return await this.productService.getProductById(id);
        }
        catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
