import * as BaseSchema from '../base.schema';

export const TagSchema = BaseSchema.create({
	name: {
		type: String,
        required: true,
        unique: true
	}
});
