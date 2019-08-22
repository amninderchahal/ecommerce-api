import * as mongoose_delete from 'mongoose-delete';
import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

export function create(model): mongoose.Schema {
    const baseSchema = new Schema({
        createdAt: {
            type: Date,
            default: new Date(),
            select: false
        },
        updatedAt: {
            type: Date,
            default: new Date(),
            select: false
        }
    });
    baseSchema.plugin(mongoose_delete, { overrideMethods: true });

    baseSchema.add(model);

    return baseSchema;
}