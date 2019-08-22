import { Document } from 'mongoose';

export interface Role extends Document {
    _id: string;
    name: string;
}