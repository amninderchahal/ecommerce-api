import { RoleSchema } from './schema/role.schema';
import { UserSchema } from './schema/user.schema';
import { FilterSchema } from './schema/filter.schema';
import { TagSchema } from './schema/tag.schema';
import { ProductSchema } from './schema/product.schema';
import { 
    ROLE_MODEL_TOKEN, 
    USER_MODEL_TOKEN, 
    FILTER_MODEL_TOKEN, 
    PRODUCT_MODEL_TOKEN, 
    TAG_MODEL_TOKEN
} from './model-tokens';

export const modelDeclarations = [
    { name: ROLE_MODEL_TOKEN, schema: RoleSchema },
    { name: USER_MODEL_TOKEN, schema: UserSchema },
    { name: FILTER_MODEL_TOKEN, schema: FilterSchema },
    { name: PRODUCT_MODEL_TOKEN, schema: ProductSchema },
    { name: TAG_MODEL_TOKEN, schema: TagSchema },
];