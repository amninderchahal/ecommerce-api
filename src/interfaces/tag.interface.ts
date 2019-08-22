import { Document } from 'mongoose';

export interface Tag extends Document {
    _id: string;
    name: string;
}