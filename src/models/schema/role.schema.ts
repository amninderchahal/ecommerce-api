import { Schema } from 'mongoose';

export const RoleSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
});