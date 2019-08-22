import { Module } from '@nestjs/common';
import { ProductMigration } from './product.migration';
import { TagMigration } from './tag.migration';
import { FilterMigration } from './filter.migration';
import { RoleMigration } from './role.migration';

@Module({
    providers: [
        ProductMigration,
        TagMigration,
        FilterMigration,
        RoleMigration
    ]
})
export class MigrationModule {}
