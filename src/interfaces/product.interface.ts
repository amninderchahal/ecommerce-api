import { Document } from 'mongoose';

interface Price {
    price: any;
    currency: string;
}

export interface Product extends Document {
    _id: string;
    title: string;
    description: string;
    ingredients: string[];
    productPage: string;
    productUrl: string;
    productType: string;
    tags: any[];
    categories: string[];
    visible: boolean;
    imageUrls: string[];
    sku: string;
    vendor: string;
    price: Price;
    salePrice: Price;
    onSale: boolean;
    stock: string;
    measurements: {
        weight: number;
        length: number;
        width: number;
        height: number;
    };
}