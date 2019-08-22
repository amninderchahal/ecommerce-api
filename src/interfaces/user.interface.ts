import { Document } from 'mongoose';

export interface User extends Document {
    _id: string;
    firstName: string;
	lastName: string;
	email: {
        _id: string;
        emailAddress: string;
        isConfirmed: boolean;
    };
	phoneNumber: number;
	password: string;
	role: any;
	favourites: any[];
	cart: any[];
	tags: any[];
	filters: any[];
}