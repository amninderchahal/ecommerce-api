import { Document } from 'mongoose';

export interface NewsLetter extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}