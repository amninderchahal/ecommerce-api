import { Document } from 'mongoose';

export interface Filter extends Document {
    _id: string;
    name: string;
}