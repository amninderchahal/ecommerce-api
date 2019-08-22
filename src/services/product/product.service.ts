import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PRODUCT_MODEL_TOKEN } from '../../models/model-tokens';
import { Model, Query } from 'mongoose';
import { Product } from '../../interfaces/product.interface';

@Injectable()
export class ProductService {
    public docsPerPage = 32;
    private defaultFields = 'title vendor price salePrice onSale imageUrls ';

    constructor(
        @InjectModel(PRODUCT_MODEL_TOKEN) private readonly productModel: Model<Product>
    ) { }

    async getProducts(pageNumber: number, searchQuery: string) {
        const query: any = { visible: true };
        if (searchQuery) {
            const regexSearchQuery = new RegExp(`^.*${searchQuery}.*$`, 'i');
            query.$or = [
                { title: regexSearchQuery },
                { vendor: regexSearchQuery }
            ];
        }
        try {
            return await Promise.all([this.productModel.count(query), this.getProductsFromDbWithPages(pageNumber, query)]);
        }
        catch (err) {
            console.log('Get Products error', err);
            throw 'Unexpected error occurred while getting products';
        }
    }

    async getProductById(id: string) {
        try {
            return await this.productModel.findOne({ _id: id, visible: true })
                .select(`${this.defaultFields} description`);
        }
        catch (err) {
            console.log('Get Product by id error', err);
            throw 'Unexpected error occurred while getting product';
        }
    }

    async getNewArrivals() {
        const now = new Date();
        const query = {
            visible: true,
            createdAt: {
                $gte: now.setDate(now.getDate() - 7) // 7 days ago
            }
        };

        try {
            return await this.getProductsFromDb(query)
                .sort({ 'createdAt': -1 })
                .limit(16)
                .exec();
        } catch (err) {
            console.log('Get new arrivals error', err);
            throw 'Unexpected error occurred while getting new arrivals';
        }
    }


    private getProductsFromDbWithPages(pageNumber: number, query: any): any {
        return this.getProductsFromDb(query)
            .limit(this.docsPerPage)
            .skip(this.docsPerPage * pageNumber)
            .exec();
    }

    private getProductsFromDb(query, additionalFields?): Query<Product[]> {
        const fields = this.defaultFields + (additionalFields ? additionalFields : '');
        return this.productModel.find(query)
            .select(fields);
    }

}
