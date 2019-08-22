import * as mongoose from 'mongoose';
import * as BaseSchema from '../base.schema';

const EmailSchema = new mongoose.Schema({
	emailAddress: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	isConfirmed: {
		type: Boolean,
		default: false
	}
});

const cartSchema = new mongoose.Schema({
	product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product'
	},
	quantity: Number
});

//User Schema
export const UserSchema = BaseSchema.create({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: EmailSchema,
	phoneNumber: {
		type: Number
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	role: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Role"
	},
	favourites: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product'
	}],
	cart: [cartSchema],
	tags: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Tag'
	}],
	filters: [{
		id: { type: mongoose.Schema.Types.ObjectId, ref: 'Filter' },
		order: { type: Number, default: 0 }
	}]
});