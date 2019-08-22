import * as BaseSchema from '../base.schema';
import * as mongoose from 'mongoose';


const PriceSchema = new mongoose.Schema({
    price: mongoose.Schema.Types.Decimal128,
    currency: String
},
    { _id: false });

export const ProductSchema = BaseSchema.create({
    title: {
        type: String,
        required: true,
        index: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [String],
    productPage: String,
    productUrl: String,
    productType: String,
    tags: [String],
    categories: [String],
    visible: Boolean,
    imageUrls: [String],
    sku: String,
    vendor: {
        type: String,
        index: true
    },
    price: PriceSchema,
    salePrice: PriceSchema,
    onSale: Boolean,
    stock: String,
    measurements: {
        weight: Number,
        length: Number,
        width: Number,
        height: Number
    }
});

PriceSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.price = typeof ret.price === 'object' ? ret.price.toString() : ret.price;
        ret.salePrice = typeof ret.salePrice === 'object' ? ret.salePrice.toString() : ret.salePrice;
        return ret;
    },
});