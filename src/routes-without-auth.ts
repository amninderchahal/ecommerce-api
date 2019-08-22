import { RequestMethod } from '@nestjs/common';

export const routesWithoutAuth = [
    { path: '/api/auth/', method: RequestMethod.ALL },
    { path: '/api/user/register', method: RequestMethod.ALL },
    { path: '/api/user/email/confirm', method: RequestMethod.ALL },
    { path: '/api/user/tags', method: RequestMethod.ALL },
    { path: '/api/user/filters', method: RequestMethod.ALL },
    { path: '/api/product/', method: RequestMethod.ALL },
    { path: '/api/products', method: RequestMethod.ALL },
    { path: '/api/swagger', method: RequestMethod.ALL },
];