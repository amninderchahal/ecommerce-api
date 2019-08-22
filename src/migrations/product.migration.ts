import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PRODUCT_MODEL_TOKEN } from "../models/model-tokens";
import { Product } from "../interfaces/product.interface";
import * as fs from 'fs';
import * as async from 'async';
import * as csv from 'csv-parser';
import * as path from 'path';

@Injectable()
export class ProductMigration {
    private products = [];
    private isFirstProductPushError = true;
    private isFirstProductSaveError = true;
    private isFirstError = true;

    constructor(
        @InjectModel(PRODUCT_MODEL_TOKEN) private readonly productModel: Model<Product>
    ) {
        fs.createReadStream(path.resolve(__dirname, '../../assets/products.csv'))
            .on('error', err => console.log('Product migration error', err))
            .pipe(csv())
            .on('data', (product) => this.addCsvObjToProducts(product))
            .on('end', () => {
                async.each(this.products, async product => {
                    try {
                        const existingProduct = await this.productModel.findOne({
                            title: product.title,
                            sku: product.sku
                        });
                        if (!existingProduct) {
                            this.addNewProduct(product);
                        }
                    }
                    catch (err) {
                        if (this.isFirstError) {
                            console.log('Products migration error', err);
                            this.isFirstError = false;
                        }
                    }
                });
            });
    }

    addCsvObjToProducts(product) {
        try {
            if (!product['Title']) return; // Don't add if no title
            this.products.push({
                title: product['Title'],
                description: product['Description'],
                productPage: product['Product Page'],
                productUrl: product['Product URL'],
                productType: product['Product Type'],
                tags: this.getArrayFromString(product['Tags']),
                categories: this.getArrayFromString(product['Categories']),
                visible: this.getBooleanFromString(product['Visible']),
                imageUrls: this.getArrayFromString(product['Hosted Image URLs']),
                sku: product['SKU'].replace(/^,|,$/g, ''),
                vendor: product['Option Value 1'],
                price: {
                    price: product['Price'].split(' ')[0],
                    currency: product['Price'].split(' ')[1]
                },
                salePrice: {
                    price: product['Sale Price'].split(' ')[0],
                    currency: product['Sale Price'].split(' ')[1]
                },
                onSale: this.getBooleanFromString(product['On Sale']),
                stock: product['Stock'],
                measurements: {
                    weight: product['Weight'],
                    length: product['Length'],
                    width: product['Width'],
                    height: product['Height']
                }
            });
        } catch (err) {
            if (this.isFirstProductPushError) {
                console.log('Product push error', err);
                this.isFirstProductPushError = false;
            }
        }
    }

    private async addNewProduct(product) {
        try {
            await new this.productModel(product).save();
        }
        catch (err) {
            if (this.isFirstProductSaveError) {
                console.log('Product save error - product', product);
                console.log('Product save error - error', err);
                this.isFirstProductSaveError = false;
            }
        }
    }

    private getArrayFromString(str) {
        return str.replace(/^,|,$/g, '').split(',');
    }

    private getBooleanFromString(str) {
        if (typeof str === 'boolean') {
            return str;
        }
        else if (typeof str === 'string') {
            return str.toLowerCase() === 'true' ? true : false;
        }
        else {
            return false;
        }
    }
}
