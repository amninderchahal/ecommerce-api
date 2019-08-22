import * as BaseSchema from '../base.schema';

export const FilterSchema = BaseSchema.create({
	name: {
		type: String,
        required: true,
        unique: true
	}
});